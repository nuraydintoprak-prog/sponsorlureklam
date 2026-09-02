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

// Sponsorlu Reklam'ın hizmet alanına göre tohum kelimeler — genişletildikçe
// burayı güncelleyin. DataForSEO bunlardan "ilgili anahtar kelimeler" türetir.
const SEED_KEYWORDS = [
  "google ads yönetimi",
  "google ads ajansı",
  "reklam ajansı fiyatları",
  "web tasarım fiyatları",
  "kurumsal web sitesi",
  "tıklama sahtekarlığı",
  "geçersiz tıklama",
  "google ads bütçesi",
  "yerel seo",
  "google reklam nasıl verilir",
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

/* Daha önce önerilmiş/kullanılmış anahtar kelimeler (tekrar önermemek için) */
function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
  } catch {
    return { used: [] };
  }
}
function saveHistory(history) {
  fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function fetchKeywordIdeas() {
  const auth = Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        keywords: SEED_KEYWORDS,
        location_name: "Turkey",
        language_name: "Turkish",
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
  console.log("DataForSEO'dan anahtar kelime fikirleri çekiliyor...");
  const ideas = await fetchKeywordIdeas();
  const coverage = existingCoverage();
  const history = loadHistory();
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
    console.log("Uygun yeni aday bulunamadı (hepsi ya kullanılmış ya da mevcut içerikle çakışıyor).");
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(CANDIDATES_FILE), { recursive: true });
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(adaylar, null, 2));

  console.log(`\n${adaylar.length} aday bulundu, en yüksek hacimliler:\n`);
  adaylar.slice(0, 10).forEach((a, i) => {
    console.log(`${i + 1}. "${a.keyword}" — ${a.search_volume}/ay (rekabet: ${a.competition || "?"})`);
  });

  if (!LIST_MODE) {
    // Otomatik modda: en yüksek hacimli adayı "kullanıldı" olarak işaretle (draft-article.js bunu işleyecek)
    history.used.push(adaylar[0].keyword);
    saveHistory(history);
    console.log(`\nSeçilen konu: "${adaylar[0].keyword}" (${adaylar[0].search_volume}/ay)`);
  }

  console.log(`\nAdaylar yazıldı: ${path.relative(ROOT, CANDIDATES_FILE)}`);
}

main().catch((e) => {
  console.error("\n❌ " + e.message);
  process.exit(1);
});
