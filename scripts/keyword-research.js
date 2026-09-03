/**
 * Anahtar kelime araştırması — DataForSEO (Google arama hacmi verisi)
 *
 * Sponsorlu Reklam'ın konu başlıklarını tohum alıp gerçek aylık arama hacmi
 * verisi çeker, mevcut yazılarla çakışmayanları hacme göre sıralar, en iyi
 * adayı (veya --list ile tüm adayları) yazdırır.
 *
 * KULLANIM:
 *   DATAFORSEO_LOGIN=... DATAFORSEO_PASSWORD=... node scripts/keyword-research.js
 *   DATAFORSEO_LOGIN=... DATAFORSEO_PASSWORD=... node scripts/keyword-research.js --list
 *
 * ÇIKTI: draft-article.js'in okuyacağı data/keyword-candidates.json dosyası.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const LOGIN = process.env.DATAFORSEO_LOGIN;
const PASSWORD = process.env.DATAFORSEO_PASSWORD;
const LIST_MODE = process.argv.includes("--list");

if (!LOGIN || !PASSWORD) {
  console.error("HATA: DATAFORSEO_LOGIN ve DATAFORSEO_PASSWORD ortam değişkenleri gerekli.");
  process.exit(1);
}

// 4 içerik sütunu — her gün sırayla biri hedeflenir (bkz. clusterForRun aşağıda).
// Her kümenin altında DataForSEO'dan "ilgili anahtar kelimeler" türetilir.
const TOPIC_CLUSTERS = [
  {
    name: "Google Ads Kampanya Yönetimi",
    contentHint:
      "Google Ads reklam verme, kampanya kurulumu/yönetimi, bütçe, hedefleme gibi genel Google Ads danışmanlığı konuları.",
    seeds: [
      "google ads reklam yönetimi",
      "google ads ajansı",
      "google ads kampanya yönetimi",
      "google reklam nasıl verilir",
      "google ads bütçesi ne kadar olmalı",
      "reklam ajansı fiyatları",
      "google ads hesabı kurulumu",
      "kalite puanı nasıl yükseltilir",
    ],
  },
  {
    name: "Google Ads Sahte Tıklama",
    contentHint:
      "Google Ads'te sahte/geçersiz tıklama, tıklama sahtekarlığı, bot trafiği, bütçe israfı konuları. Bu kümede " +
      "AntiClick.com.tr'ye (tıklama sahtekarlığı koruma yazılımı) tek bir doğal, dürüst referans/link verilebilir.",
    seeds: [
      "google ads sahte tıklama",
      "tıklama sahtekarlığı",
      "geçersiz tıklama",
      "google ads bot trafiği",
      "reklam bütçesi çalınıyor",
      "click fraud nedir",
      "rakip tıklaması nasıl anlaşılır",
      "google ads ip engelleme",
    ],
  },
  {
    name: "İl Bazlı Web Tasarım Firmaları",
    contentHint:
      "Belirli bir ile özgü web tasarım ihtiyaçları/firma arayışı. Yazı, ilgili web-tasarim/{il}.html ve " +
      "google-ads/{il}.html sayfalarına (mevcutsa) link vermeli.",
    seeds: [
      "izmir web tasarım firması",
      "aydın web tasarım firması",
      "denizli web tasarım firması",
      "antalya web tasarım firması",
      "muğla web tasarım firması",
      "istanbul web tasarım firması",
      "bursa web tasarım firması",
      "web tasarım fiyatları 2026",
    ],
  },
  {
    name: "AntiClick Tanıtımı",
    contentHint:
      "Tıklama sahtekarlığından/bot trafiğinden korunma çözümleri. Bu küme AntiClick.com.tr'yi (aynı ekibin " +
      "tıklama sahtekarlığı koruma ürünü) ANA çözüm olarak tanıtan, dürüst ve bilgilendirici bir yazı üretmeli — " +
      "abartılı satış dili değil, ürünün nasıl çalıştığını ve hangi sorunu çözdüğünü anlatan bir yaklaşım.",
    seeds: [
      "google ads sahte tıklamalardan korunma",
      "reklam tıklama koruması yazılımı",
      "bot trafiği engelleme",
      "tıklama sahtekarlığı önleme yazılımı",
      "google ads ip dışlama otomatik",
      "reklam bütçesi koruma",
    ],
  },
];

const HISTORY_FILE = path.join(ROOT, "data", "keyword-history.json");
const CANDIDATES_FILE = path.join(ROOT, "data", "keyword-candidates.json");

/* Mevcut yazıların başlık ve içindeki anahtar kelimelerini topla — aynı konuyu tekrar önermemek için */
function existingCoverage() {
  const blogDir = path.join(ROOT, "blog");
  const files = fs.existsSync(blogDir) ? fs.readdirSync(blogDir).filter((f) => f.endsWith(".html")) : [];
  const text = files
    .map((f) => fs.readFileSync(path.join(blogDir, f), "utf8"))
    .join(" ")
    .toLowerCase();
  return text;
}

/* Daha önce önerilmiş/kullanılmış anahtar kelimeler + küme rotasyonu (tekrar önermemek, sırayla dönmek için) */
function loadHistory() {
  try {
    const h = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
    if (typeof h.clusterIndex !== "number") h.clusterIndex = -1;
    return h;
  } catch {
    return { used: [], clusterIndex: -1 };
  }
}
function saveHistory(history) {
  fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function fetchKeywordIdeas(seeds) {
  const auth = Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        keywords: seeds,
        location_code: 2792, // Türkiye — https://api.dataforseo.com/v3/keywords_data/google_ads/locations (location_name "Turkey" GEÇERSİZ, "Turkiye" olarak listeleniyor; kod daha kararlı)
        language_code: "tr", // ISO 639-1
        sort_by: "search_volume",
      },
    ]),
  });
  if (!res.ok) throw new Error(`DataForSEO HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const task = json.tasks && json.tasks[0];
  if (!task || task.status_code !== 20000) {
    throw new Error(`DataForSEO görev hatası: ${task ? task.status_message : "yanıt boş"}`);
  }
  return task.result || [];
}

async function main() {
  const history = loadHistory();
  // 4 küme sırayla döner (0->1->2->3->0->...) — her gün farklı bir içerik sütunu hedeflenir.
  const clusterIndex = (history.clusterIndex + 1) % TOPIC_CLUSTERS.length;
  const cluster = TOPIC_CLUSTERS[clusterIndex];
  history.clusterIndex = clusterIndex;

  console.log(`Bugünkü küme: "${cluster.name}" (${clusterIndex + 1}/${TOPIC_CLUSTERS.length})`);
  console.log("DataForSEO'dan anahtar kelime fikirleri çekiliyor...");
  const ideas = await fetchKeywordIdeas(cluster.seeds);
  const coverage = existingCoverage();
  const usedSet = new Set(history.used.map((k) => k.toLowerCase()));

  const adaylar = ideas
    .filter((k) => k.keyword && k.search_volume)
    .filter((k) => {
      const kw = k.keyword.toLowerCase();
      if (usedSet.has(kw)) return false;
      // Kelimenin ana sözcükleri zaten mevcut bir makalede geçiyorsa ele — kaba bir çakışma filtresi.
      const kelimeler = kw.split(/\s+/).filter((w) => w.length > 3);
      const kacTanesiGeciyor = kelimeler.filter((w) => coverage.includes(w)).length;
      return kelimeler.length === 0 || kacTanesiGeciyor / kelimeler.length < 0.7;
    })
    .sort((a, b) => (b.search_volume || 0) - (a.search_volume || 0))
    .slice(0, LIST_MODE ? 30 : 10)
    .map((k) => ({
      keyword: k.keyword,
      search_volume: k.search_volume,
      competition: k.competition,
      cpc: k.cpc,
    }));

  if (adaylar.length === 0) {
    console.log("Bu kümede uygun yeni aday bulunamadı (hepsi ya kullanılmış ya da mevcut içerikle çakışıyor).");
    if (!LIST_MODE) saveHistory(history); // rotasyon yine de ilerlesin — yarın bir sonraki küme denenir
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(CANDIDATES_FILE), { recursive: true });
  fs.writeFileSync(
    CANDIDATES_FILE,
    JSON.stringify(
      adaylar.map((a) => ({ ...a, cluster: cluster.name, contentHint: cluster.contentHint })),
      null,
      2
    )
  );

  console.log(`\n${adaylar.length} aday bulundu, en yüksek hacimliler:\n`);
  adaylar.slice(0, 10).forEach((a, i) => {
    console.log(`${i + 1}. "${a.keyword}" — ${a.search_volume}/ay (rekabet: ${a.competition || "?"})`);
  });

  if (!LIST_MODE) {
    // Otomatik modda: en yüksek hacimli adayı "kullanıldı" olarak işaretle (draft-article.js bunu işleyecek)
    history.used.push(adaylar[0].keyword);
    saveHistory(history);
    console.log(`\nSeçilen konu: "${adaylar[0].keyword}" (${adaylar[0].search_volume}/ay) — küme: ${cluster.name}`);
  }

  console.log(`\nAdaylar yazıldı: ${path.relative(ROOT, CANDIDATES_FILE)}`);
}

main().catch((e) => {
  console.error("\n❌ " + e.message);
  process.exit(1);
});
