/**
 * AI makale taslağı üretici — Sponsorlu Reklam
 *
 * Claude API'yi (Node yerleşik fetch ile, SDK bağımlılığı yok) çağırıp
 * yapılandırılmış JSON bir blog makalesi taslağı ürettirir ve siteye yerleştirir.
 *
 * KULLANIM:
 *   ANTHROPIC_API_KEY=sk-ant-...  node scripts/draft-article.js ["makale konusu"]
 *   Konu verilmezse model, mevcut yazılarla çakışmayan yeni bir konu önerir.
 *
 * ÇIKTI: blog/<slug>.html + blog.html/sitemap.xml/llms.txt güncellenir, CSS gömülür.
 * İNSAN ONAYI: Bu script taslak üretir; yayın kararı senin (PR'ı incele/merge et).
 */
const fs = require("fs");
const path = require("path");
const { applyToSite } = require("../lib/article");

const ROOT = path.join(__dirname, "..");
const MODEL = "claude-opus-4-8";
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("HATA: ANTHROPIC_API_KEY ortam değişkeni gerekli.");
  process.exit(1);
}

/* Mevcut yazıların başlık + slug'larını topla (çakışmayı önlemek için) */
function existingArticles() {
  const slugs = fs.readdirSync(path.join(ROOT, "blog")).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, ""));
  const blog = fs.readFileSync(path.join(ROOT, "blog.html"), "utf8");
  const titles = [...blog.matchAll(/<a href="blog\/[^"]+"[^>]*>([^<]+)<\/a>/g)].map((m) => m[1].trim());
  return { slugs, titles };
}

/* ---- JSON şeması (output_config.format) — uzunluk kısıtları desteklenmez, promptta belirtilir ---- */
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["slug", "tag", "section", "crumb", "title", "h1", "desc", "ogDesc", "keywords", "readMin", "lead", "body", "cta"],
  properties: {
    slug: { type: "string", description: "kebab-case, sadece ascii harf/rakam/tire, örn: remarketing-rehberi" },
    tag: { type: "string", description: "Kısa etiket: Google Ads | Web Tasarım | Optimizasyon | Strateji | Dönüşüm | Yerel Reklam" },
    section: { type: "string", description: "tag ile aynı veya benzeri bölüm adı" },
    crumb: { type: "string", description: "Çok kısa breadcrumb etiketi (1-2 kelime)" },
    title: { type: "string", description: "SEO başlık etiketi (55-60 karakter ideal)" },
    h1: { type: "string", description: "Sayfa H1 başlığı" },
    desc: { type: "string", description: "Meta description (120-155 karakter)" },
    ogDesc: { type: "string", description: "Kısa sosyal/özet açıklama (max ~110 karakter)" },
    keywords: { type: "string", description: "virgülle ayrılmış 4-6 anahtar kelime" },
    readMin: { type: "integer", description: "Tahmini okuma süresi (dakika), 5-9 arası" },
    lead: { type: "string", description: "Hero altındaki giriş paragrafı (1-2 cümle, düz metin, HTML yok)" },
    body: {
      type: "string",
      description:
        "Makale gövdesi TEK bir HTML string. İzinli etiketler: <h2>, <h3>, <p>, <ul>/<li>, <ol>/<li>, <blockquote>, <strong>, <a>. <h1> KULLANMA. Sıralı başlık (h2'den sonra h3). 5-8 <h2> bölüm. Son paragraf ../rezervasyon.html'e CTA linki içersin.",
    },
    cta: {
      type: "object",
      additionalProperties: false,
      required: ["h2", "p"],
      properties: {
        h2: { type: "string", description: "Sayfa sonu CTA başlığı" },
        p: { type: "string", description: "CTA açıklama cümlesi" },
      },
    },
  },
};

/* ---- Sistem promptu (KARARLI prefix → cache'lenir) ---- */
const SYSTEM_PROMPT = `Sen "Sponsorlu Reklam" için içerik üreten bir Türkçe SEO yazarısın.

ŞİRKET: Sponsorlu Reklam — Aydın (Efeler) merkezli, Türkiye geneline uzaktan hizmet veren web tasarım + Google Ads yönetim ajansı. Tek odak: SEO uyumlu kurumsal web siteleri ve Google Ads kurulum/yönetimi. Aylık Google Ads yönetimi 5.000 TL'den, web tasarım 17.000 TL'den başlar; reklam bütçesi ayrıdır, doğrudan Google'a ödenir.

SES TONU: Pratik, dürüst, sahadan, abartısız. Satış/gelir garantisi VERME. Net, sade Türkçe. Clickbait yok.

BİÇİM KURALLARI (çıktı JSON şemasına uymalı):
- body TEK bir HTML string; yalnızca <h2> <h3> <p> <ul>/<li> <ol>/<li> <blockquote> <strong> <a> kullan. <h1> YASAK.
- Başlık sırası atlama: bir <h2> bölümü altındaki alt başlıklar <h3> olsun (h2→h4 atlama yok).
- 5-8 adet <h2> bölüm; toplam ~1200-1700 kelime.
- İç linkler (mutlaka 3-6 adet ekle), göreli yollar:
  * Aynı blog içi: <a href="negatif-anahtar-kelime-listesi.html">
  * Hizmetler: <a href="../hizmetler/google-ads.html">, <a href="../hizmetler/web-tasarim.html">
  * Şehir sayfaları: ../google-ads/aydin.html (izmir, denizli, mugla, antalya) ve ../web-tasarim/<sehir>.html
  * Eylem: <a href="../rezervasyon.html"> ve <a href="../paketler.html">
  * Yalnızca SANA VERİLEN mevcut slug listesindeki blog yazılarına link ver; uydurma slug kullanma.
- body'nin son paragrafı ../rezervasyon.html'e bir çağrı içersin.
- slug benzersiz, kebab-case, ascii (ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c).
- desc 120-155, title 55-60 karakter civarı; ogDesc kısa.

SADECE şemaya uygun JSON üret; başka metin ekleme.`;

async function main() {
  const topicArg = process.argv.slice(2).join(" ").trim();
  const { slugs, titles } = existingArticles();

  const userMessage =
    (topicArg
      ? `Konu: "${topicArg}". Bu konuda bir blog makalesi taslağı üret.`
      : `Mevcut yazılarla çakışmayan, tamamlayıcı YENİ bir blog konusu seç ve o konuda makale taslağı üret.`) +
    `\n\nMevcut başlıklar:\n- ${titles.join("\n- ")}` +
    `\n\nKullanımdaki slug'lar (bunlarla çakışma, ama bunlara link verebilirsin):\n${slugs.join(", ")}`;

  const body = {
    model: MODEL,
    max_tokens: 12000,
    thinking: { type: "adaptive" },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [{ role: "user", content: userMessage }],
  };

  console.log("Claude API çağrılıyor (model: " + MODEL + ")...");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API hatası ${res.status}: ${txt}`);
  }
  const data = await res.json();
  if (data.stop_reason === "refusal") throw new Error("Model reddetti: " + JSON.stringify(data.stop_details || {}));
  if (data.stop_reason === "max_tokens") console.warn("UYARI: max_tokens'a ulaşıldı, içerik kesik olabilir.");

  const textBlock = (data.content || []).find((b) => b.type === "text");
  if (!textBlock) throw new Error("Yanıtta metin bloğu yok.");
  const article = JSON.parse(textBlock.text);

  // Tarih alanlarını script doldurur (model'e bırakma)
  const now = new Date();
  const aylar = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  article.date = now.toISOString().slice(0, 10);
  article.dateDisp = `${now.getDate()} ${aylar[now.getMonth()]} ${now.getFullYear()}`;

  const u = data.usage || {};
  console.log(`Üretildi: "${article.title}" (slug: ${article.slug})`);
  console.log(`Token: giriş ${u.input_tokens}, çıkış ${u.output_tokens}, cache okuma ${u.cache_read_input_tokens || 0}`);

  const file = applyToSite(article);
  console.log("\n✅ Taslak yerleştirildi: " + path.relative(ROOT, file));
  console.log("blog.html, sitemap.xml, llms.txt güncellendi; CSS gömüldü.");
  console.log("\nŞimdi taslağı incele, beğenirsen commit/PR ile yayınla.");
}

main().catch((e) => {
  console.error("\n❌ " + e.message);
  process.exit(1);
});
