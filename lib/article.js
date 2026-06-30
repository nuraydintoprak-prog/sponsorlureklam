/**
 * Blog makalesi şablonu + siteye yerleştirme yardımcıları — Sponsorlu Reklam
 *
 * Bir makale nesnesini (aşağıdaki şema) alıp:
 *   - blog/<slug>.html üretir (mevcut blog tasarımıyla birebir)
 *   - blog.html'e kart ekler (en üste)
 *   - sitemap.xml'e <url> ekler
 *   - llms.txt blog listesine satır ekler
 *   - CSS'i gömmek için build-inline-css.js çalıştırır
 *
 * Makale nesnesi alanları:
 *   slug, tag, section, crumb, title, h1, desc, ogDesc, keywords,
 *   readMin (sayı), date (YYYY-MM-DD), dateDisp (örn "2 Haziran 2026"),
 *   lead (string), body (HTML string), cta { h2, p }
 *
 * NOT: Tasarım şablonu burada ve build-blog.js'te ayrı ayrı durur; biri
 * değişirse diğerini de güncelle. (Otomasyon bu dosyayı kullanır.)
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SITE = "https://sponsorlureklam.com.tr";
const ROOT = path.join(__dirname, "..");

/* HTML attribute/metin kaçışı (model üretimi güvenli olsun) */
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function renderArticle(a) {
  const url = `${SITE}/blog/${a.slug}.html`;
  const iso = `${a.date}T09:00:00+03:00`;
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.title)}</title>
<meta name="description" content="${esc(a.desc)}">
<meta name="keywords" content="${esc(a.keywords)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Sponsorlu Reklam">
<meta name="theme-color" content="#0a2540">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.h1)}">
<meta property="og:description" content="${esc(a.ogDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/og-image.png">
<meta property="og:locale" content="tr_TR">
<meta property="article:published_time" content="${iso}">
<meta property="article:section" content="${esc(a.section)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.h1)}">
<meta name="twitter:description" content="${esc(a.ogDesc)}">
<link rel="icon" type="image/svg+xml" href="../img/logo.svg">
<link rel="icon" type="image/png" sizes="32x32" href="../img/favicon-32.png">
<link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-400-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/playfair-700-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/playfair-700-latin-ext.woff2" crossorigin>
<link rel="stylesheet" href="../css/style.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": ${JSON.stringify(a.title)},
  "description": ${JSON.stringify(a.desc)},
  "image": "${SITE}/img/og-image.png",
  "datePublished": "${iso}",
  "dateModified": "${iso}",
  "author": { "@type": "Organization", "name": "Sponsorlu Reklam" },
  "publisher": { "@type": "Organization", "name": "Sponsorlu Reklam", "logo": { "@type": "ImageObject", "url": "${SITE}/img/logo.png" } },
  "mainEntityOfPage": "${url}"
}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Anasayfa","item":"${SITE}/"},
  {"@type":"ListItem","position":2,"name":"Blog","item":"${SITE}/blog.html"},
  {"@type":"ListItem","position":3,"name":${JSON.stringify(a.crumb)},"item":"${url}"}
]}
</script>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <a href="../index.html" class="logo" aria-label="Sponsorlu Reklam">
      <img src="../img/logo.svg" alt="Sponsorlu Reklam logosu" width="38" height="38">
      <span class="logo-text">Sponsorlu Reklam<small>web & google ads</small></span>
    </a>
    <button class="nav-toggle" aria-label="Menüyü aç/kapat"><span></span><span></span><span></span></button>
    <nav class="nav" aria-label="Ana menü">
      <a href="../index.html">Anasayfa</a>
      <a href="../hakkimizda.html">Hakkımızda</a>
      <a href="../hizmetler.html">Hizmetler</a>
      <a href="../paketler.html">Paketler</a>
      <a href="../vaka-calismalari.html">Vakalar</a>
      <a href="../blog.html">Blog</a>
      <a href="../sss.html">SSS</a>
      <a href="../rezervasyon.html">Rezervasyon</a>
      <a href="../iletisim.html" class="btn-cta">İletişim</a>
    </nav>
  </div>
</header>

<section class="page-hero">
  <div class="container">
    <div class="breadcrumb"><a href="../index.html">Anasayfa</a> / <a href="../blog.html">Blog</a> / ${esc(a.crumb)}</div>
    <h1>${esc(a.h1)}</h1>
    <p>${esc(a.lead)}</p>
  </div>
</section>

<section class="section">
  <div class="container article-content">
    <p class="article-meta">${esc(a.dateDisp)} · ${a.readMin} dk okuma · <a href="../blog.html">← Tüm Yazılar</a></p>
${a.body}
  </div>
</section>

<section class="cta-strip">
  <div class="container">
    <h2>${esc(a.cta.h2)}</h2>
    <p>${esc(a.cta.p)}</p>
    <div class="hero-actions" style="justify-content:center;">
      <a href="../rezervasyon.html" class="btn btn-primary btn-lg">Görüşme Rezervasyonu Al</a>
      <a href="../blog.html" class="btn btn-outline btn-lg">Diğer Yazılar</a>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">
          <img src="../img/logo.svg" alt="Sponsorlu Reklam logosu" width="38" height="38">
          <span class="logo-text">Sponsorlu Reklam<small>web & google ads</small></span>
        </div>
        <p>Aydın merkezli, Türkiye geneline hizmet veren web tasarım ve Google Ads ajansıyız.</p>
      </div>
      <div>
        <h3>Hizmetlerimiz</h3>
        <ul>
          <li><a href="../hizmetler/web-tasarim.html">Web Tasarım</a></li>
          <li><a href="../hizmetler/google-ads.html">Google Ads Yönetimi</a></li>
          <li><a href="../paketler.html">Paketler</a></li>
          <li><a href="../vaka-calismalari.html">Vaka Çalışmaları</a></li>
        </ul>
      </div>
      <div>
        <h3>Kurumsal</h3>
        <ul>
          <li><a href="../hakkimizda.html">Hakkımızda</a></li>
          <li><a href="../blog.html">Blog</a></li>
          <li><a href="../sss.html">SSS</a></li>
          <li><a href="../rezervasyon.html">Online Rezervasyon</a></li>
          <li><a href="../aylik-yonetim-sozlesmesi.html">Aylık Yönetim Sözleşmesi</a></li>
          <li><a href="../iletisim.html">İletişim</a></li>
        </ul>
      </div>
      <div>
        <h3>İletişim</h3>
        <ul>
          <li><a href="tel:+905468445576">0546 844 55 76</a></li>
          <li><a href="mailto:info@sponsorlureklam.com.tr">info@sponsorlureklam.com.tr</a></li>
          <li>Mimar Sinan Mah. 2341 Sk. No:4, Efeler/Aydın</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">© <span id="year">2026</span> Sponsorlu Reklam. Tüm hakları saklıdır.</div>
  </div>
</footer>

<a href="https://wa.me/905468445576" class="wa-float" rel="noopener noreferrer" aria-label="WhatsApp ile iletişim">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
</a>

<script src="../js/main.js" defer></script>
</body>
</html>
`;
}

function cardHtml(a) {
  return `      <article class="card">
        <span class="tag tag-gold">${esc(a.tag)}</span>
        <h3 class="mt-3"><a href="blog/${a.slug}.html" style="color:inherit;">${esc(a.h1)}</a></h3>
        <p class="article-meta">${esc(a.dateDisp)} · ${a.readMin} dk okuma</p>
        <p>${esc(a.ogDesc)}</p>
        <a href="blog/${a.slug}.html" class="btn btn-ghost mt-3">Yazıyı Oku</a>
      </article>`;
}

function sitemapEntry(a) {
  return `  <url>
    <loc>${SITE}/blog/${a.slug}.html</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}

const llmsEntry = (a) => `- [${a.h1}](${SITE}/blog/${a.slug}.html)`;

/* Makaleyi siteye yerleştir (idempotent değildir; slug benzersiz olmalı) */
function applyToSite(a) {
  const errors = [];
  // 0) slug çakışması
  const file = path.join(ROOT, "blog", `${a.slug}.html`);
  if (fs.existsSync(file)) throw new Error(`Slug zaten var: blog/${a.slug}.html`);

  // 1) makale HTML
  fs.writeFileSync(file, renderArticle(a), "utf8");

  // 2) blog.html — kartı grid'in en üstüne ekle
  const blogPath = path.join(ROOT, "blog.html");
  let blog = fs.readFileSync(blogPath, "utf8");
  const gridAnchor = '<div class="grid grid-3">\n';
  if (!blog.includes(gridAnchor)) errors.push("blog.html: grid grid-3 bulunamadı");
  else blog = blog.replace(gridAnchor, gridAnchor + "\n" + cardHtml(a) + "\n");
  fs.writeFileSync(blogPath, blog, "utf8");

  // 3) sitemap.xml — ilk blog url'inden önce ekle
  const smPath = path.join(ROOT, "sitemap.xml");
  let sm = fs.readFileSync(smPath, "utf8");
  const firstBlog = `  <url>\n    <loc>${SITE}/blog/`;
  const idx = sm.indexOf(firstBlog);
  if (idx === -1) errors.push("sitemap.xml: blog url bölümü bulunamadı");
  else sm = sm.slice(0, idx) + sitemapEntry(a) + "\n" + sm.slice(idx);
  fs.writeFileSync(smPath, sm, "utf8");

  // 4) llms.txt — blog listesinin başına ekle
  const llmsPath = path.join(ROOT, "llms.txt");
  let llms = fs.readFileSync(llmsPath, "utf8");
  const llmsAnchor = "## Blog (rehber yazılar)\n\n";
  if (!llms.includes(llmsAnchor)) errors.push("llms.txt: blog başlığı bulunamadı");
  else llms = llms.replace(llmsAnchor, llmsAnchor + llmsEntry(a) + "\n");
  fs.writeFileSync(llmsPath, llms, "utf8");

  // 5) CSS'i sayfaya göm
  execFileSync(process.execPath, [path.join(ROOT, "build-inline-css.js")], { stdio: "inherit" });

  if (errors.length) {
    throw new Error("Yerleştirme uyarıları (dosya yine de yazıldı):\n - " + errors.join("\n - "));
  }
  return file;
}

module.exports = { SITE, renderArticle, cardHtml, sitemapEntry, llmsEntry, applyToSite };
