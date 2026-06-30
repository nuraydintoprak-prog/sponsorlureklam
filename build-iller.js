/**
 * Şehir (il) bazlı hizmet sayfası üreticisi — Sponsorlu Reklam
 *
 * /web-tasarim/<il>.html  ve  /google-ads/<il>.html  sayfalarını üretir.
 * Yeni şehir eklemek için CITIES dizisine yeni bir nesne ekleyip
 *   node build-iller.js
 * komutunu çalıştırman yeterli. Mevcut dosyaların üzerine yazar.
 *
 * ÖNEMLİ: Üretilen sayfalar CSS'i dış <link> ile gelir. Üretimden sonra
 *   node build-inline-css.js
 * çalıştır; CSS'i sayfalara gömer (LCP için gerekli).
 */

const fs = require("fs");
const path = require("path");

const SITE = "https://sponsorlureklam.com.tr";

/* Türkçe yerel küçük harf: "İzmir" -> "izmir" (noktalı i̇ sorununu önler) */
const tl = (s) => s.toLocaleLowerCase("tr-TR");

/* ---------------------------------------------------------------- şehirler */
const CITIES = [
  {
    slug: "aydin",
    name: "Aydın",
    loc: "Aydın'da",
    gen: "Aydın'ın",
    districts: ["Efeler", "Nazilli", "Söke", "Kuşadası", "Didim", "Germencik", "İncirliova"],
    sectors:
      "zeytin ve incir üreticileri, Kuşadası ve Didim'in turizm işletmeleri, Nazilli'nin tekstil atölyeleri ve Söke ovasının tarım işletmeleri",
    web:
      "Aydın merkezliyiz; ofisimiz Efeler'de. Bu yüzden Aydın'daki işletmeleri, müşteri alışkanlıklarını ve rekabeti yakından tanıyoruz. İster Efeler'de bir klinik, ister Kuşadası'nda bir otel, ister Nazilli'de bir üretim atölyesi olun — sizi arayan müşteriye sizi bulduran, mobilde kusursuz ve hızlı açılan bir kurumsal site kuruyoruz.",
    ads:
      "Aydın merkezli ajansız ve buradaki rekabeti birinci elden biliyoruz. Kuşadası ve Didim'de turizm sezonunun yoğunluğunu, Nazilli ve Söke'de yerel hizmet aramalarını dikkate alarak Google Ads kampanyalarınızı kurup her gün optimize ediyoruz; bütçeniz ilçe ilçe doğru hedeflensin diye coğrafi ayarları sizin için inceden ayarlıyoruz.",
  },
  {
    slug: "izmir",
    name: "İzmir",
    loc: "İzmir'de",
    gen: "İzmir'in",
    districts: ["Konak", "Bornova", "Karşıyaka", "Buca", "Bayraklı", "Çiğli", "Gaziemir", "Karabağlar"],
    sectors:
      "ihracatçı üretici firmalar, Bornova ve Gaziemir'in sanayi işletmeleri, Konak ve Alsancak'ın hizmet ofisleri ile Çeşme–Urla hattının turizm işletmeleri",
    web:
      "İzmir Türkiye'nin en rekabetçi şehirlerinden biri; burada sıradan bir site fark edilmez. Konak'taki bir hizmet ofisinden Bornova'daki bir üretim firmasına kadar, İzmirli işletmenizin kurum kimliğini yansıtan, Google'da bulunan ve telefondan açıldığında kusursuz görünen özgün bir site tasarlıyoruz.",
    ads:
      "İzmir'de tıklama maliyetleri sektöre göre hızla artabilir; bütçenizin boşa gitmemesi için kampanyaları doğru kurmak şart. Konak, Bornova, Karşıyaka gibi ilçeleri ayrı ayrı hedefleyebilir, İzmirli müşterinin arama alışkanlığına göre anahtar kelime ve negatif kelime listelerini kurup her gün optimize ederiz.",
  },
  {
    slug: "denizli",
    name: "Denizli",
    loc: "Denizli'de",
    gen: "Denizli'nin",
    districts: ["Pamukkale", "Merkezefendi", "Çivril", "Acıpayam", "Tavas", "Honaz", "Buldan"],
    sectors:
      "havlu ve tekstil üreticileri, kablo ve mermer fabrikaları, Pamukkale çevresinin turizm işletmeleri ile organize sanayideki ihracat firmaları",
    web:
      "Denizli üretim ve ihracatın güçlü olduğu bir şehir; tekstilden mermere birçok firma yurt dışına satış yapıyor. Bu yüzden Denizli'deki işletmeniz için çok dilli düşünülebilen, ürün ve referanslarınızı düzgün anlatan, hızlı açılan ve SEO uyumlu bir kurumsal site kuruyoruz.",
    ads:
      "Denizli'de hem yerel hizmet aramaları hem de B2B/ihracat odaklı aramalar bir arada. Pamukkale turizminden organize sanayideki üretici firmalara kadar, hedef kitlenize göre Google Ads kampanyalarını ayrıştırıp kuruyor, bütçenizi en çok dönüşüm getiren aramalara yönlendiriyoruz.",
  },
  {
    slug: "mugla",
    name: "Muğla",
    loc: "Muğla'da",
    gen: "Muğla'nın",
    districts: ["Menteşe", "Bodrum", "Fethiye", "Marmaris", "Milas", "Datça", "Ortaca", "Dalaman"],
    sectors:
      "Bodrum, Marmaris ve Fethiye'nin otel ve konaklama işletmeleri, yat ve tekne turizmi, emlak ofisleri ile sezonluk hizmet veren işletmeler",
    web:
      "Muğla'da iş büyük ölçüde turizm ve emlak üzerine dönüyor; sezon kısa, rekabet yüksek. Bodrum'daki bir otelden Fethiye'deki bir emlak ofisine kadar, rezervasyon ve iletişimi kolaylaştıran, mobilde kusursuz ve yabancı misafirlere de hitap edebilen hızlı bir site tasarlıyoruz.",
    ads:
      "Muğla'da sezon başlamadan reklamın hazır olması gerekir; geç kalan bütçe sezonu kaçırır. Bodrum, Marmaris, Fethiye gibi ilçeleri ayrı hedefleyerek otel, villa kiralama veya emlak aramalarına göre Google Ads kampanyalarını kurar, sezon boyunca her gün optimize ederiz.",
  },
  {
    slug: "antalya",
    name: "Antalya",
    loc: "Antalya'da",
    gen: "Antalya'nın",
    districts: ["Muratpaşa", "Konyaaltı", "Kepez", "Alanya", "Manavgat", "Serik", "Kemer", "Side"],
    sectors:
      "otel ve turizm işletmeleri, Alanya ve Manavgat'ın emlak ofisleri, sera tarımı üreticileri ile şehir merkezinin hizmet firmaları",
    web:
      "Antalya turizmin başkenti; hem yerli hem yabancı müşteriye hitap eden işletmeler burada yoğun. Muratpaşa'daki bir klinikten Alanya'daki bir emlak ofisine kadar, güven veren, hızlı açılan ve mobilde kusursuz görünen, gerektiğinde yabancı misafire de uygun bir kurumsal site kuruyoruz.",
    ads:
      "Antalya'da turizm ve emlak rekabeti çok yüksek; doğru kurulmamış reklam bütçeyi hızla yakar. Muratpaşa, Konyaaltı, Alanya, Manavgat gibi ilçeleri ayrı hedefler, sezona ve hedef kitleye göre Google Ads kampanyalarını kurup her gün optimize ederek bütçenizden en yüksek verimi alırız.",
  },
];

/* --------------------------------------------------------------- hizmetler */
const SERVICES = {
  "web-tasarim": {
    folder: "web-tasarim",
    other: "google-ads",
    label: "Web Tasarım",
    mainPage: "../hizmetler/web-tasarim.html",
    price: "17000",
    h1: (c) => `${c.name} Web Tasarım`,
    title: (c) => `${c.name} Web Tasarım | SEO Uyumlu Kurumsal Web Sitesi`,
    desc: (c) =>
      `${c.loc} SEO uyumlu, mobil uyumlu ve hızlı açılan kurumsal web sitesi tasarımı. Domain ve hosting dahil, 10 sayfaya kadar özgün tasarım. Aydın merkezli ajans.`,
    keywords: (c) =>
      `${tl(c.name)} web tasarım, ${tl(c.name)} web sitesi, ${tl(c.name)} kurumsal web tasarım, ${tl(c.name)} seo uyumlu site, web tasarım ${tl(c.name)}`,
    lead: (c) =>
      `${c.loc} işletmenize gerçekten müşteri kazandıran, mobilde kusursuz görünen ve Google'da bulunabilen özgün kurumsal web siteleri tasarlıyoruz.`,
    intro: (c) => c.web,
    crossLead: (c) =>
      `${c.loc} reklam da vermek istiyorsanız, siteniz hazır olduğunda devreye girebiliriz.`,
    crossLabel: (c) => `${c.name} Google Ads Yönetimi`,
    steps: [
      ["İşinizi ve Hedef Kitlenizi Anlıyoruz", "Tasarıma başlamadan önce sizi dinliyoruz: ne iş yapıyorsunuz, kimler müşteriniz, rakipleriniz kimler? Şablon uyarlamakla değil, sizi anlamakla başlıyoruz."],
      ["SEO Uyumlu Altyapı Kuruyoruz", "URL yapısı, başlık etiketleri, meta açıklamalar ve içerik hiyerarşisi en baştan doğru kuruluyor; böylece Google sitenizi sorunsuz tanıyor."],
      ["Mobil Uyumlu Tasarım Yapıyoruz", "Ziyaretçilerin büyük çoğunluğu mobilden geliyor. Tasarımı önce mobil, sonra masaüstü için optimize ediyoruz."],
      ["Hız İçin Optimize Ediyoruz", "Görselleri sıkıştırıyor, gereksiz dosyaları temizliyor, hızlı bir hosting ortamında yayına alıyoruz. Hızlı site hem kullanıcıyı hem Google'ı memnun eder."],
      ["Dönüşüm Odaklı Yerleşim Hazırlıyoruz", "İletişim butonu, telefon ve form, en çok dönüşüm getiren yerlere yerleştiriliyor — rastgele değil."],
      ["WhatsApp ve İletişim Entegrasyonu", "Her sayfada görünen WhatsApp butonu mobilde tek dokunuşla sohbeti açar; bu basit detay dönüşümü ciddi artırır."],
    ],
    faq: (c) => [
      [`${c.loc} web tasarım ne kadar sürer?`, "Çoğu kurumsal site, içerikler hazır olduğunda 2–4 hafta içinde yayına alınır. Süre sayfa sayısına ve içeriğin sizden ne kadar hızlı geldiğine bağlıdır."],
      [`${c.loc} olmadığınız halde nasıl çalışıyorsunuz?`, "Tüm süreci uzaktan yürütüyoruz: görüşmeler telefon ve WhatsApp üzerinden, dosya paylaşımı dijital. Aydın merkezliyiz ama Türkiye geneline hizmet veriyoruz."],
      ["Domain ve hosting dahil mi?", "Evet. Web tasarım paketinde domain ve hosting ilk yıl için dahildir; sonraki yıllarda yenileme size kalır."],
    ],
  },
  "google-ads": {
    folder: "google-ads",
    other: "web-tasarim",
    label: "Google Ads Yönetimi",
    mainPage: "../hizmetler/google-ads.html",
    price: "5000",
    h1: (c) => `${c.name} Google Ads Ajansı`,
    title: (c) => `${c.name} Google Ads Ajansı | Reklam Kurulumu ve Yönetimi`,
    desc: (c) =>
      `${c.loc} Google Ads reklam hesabı kurulumu ve aylık yönetimi. Arama Ağı kampanyaları, dönüşüm takibi, negatif kelime ve IP engelleme dahil. Aydın merkezli ajans.`,
    keywords: (c) =>
      `${tl(c.name)} google ads, ${tl(c.name)} google ads ajansı, ${tl(c.name)} reklam ajansı, google ads ${tl(c.name)}, ${tl(c.name)} sponsorlu reklam`,
    lead: (c) =>
      `${c.loc} reklam bütçenizi boşa harcamadan, sizi arayan müşteriye ulaştıran Google Ads kampanyaları kuruyor ve her gün optimize ediyoruz.`,
    intro: (c) => c.ads,
    crossLead: (c) =>
      `Reklamın varış sayfası dönüşüm için zayıfsa bütçe yanar; ${c.loc} önce siteyi de hazırlayabiliriz.`,
    crossLabel: (c) => `${c.name} Web Tasarım`,
    steps: [
      ["Reklam Hesabını Sizin Adınıza Açıyoruz", "Hesabınız sizin adınıza ve yetkinizde açılır. Çalışmayı bıraktığınız gün hesap size kalır; sıfırdan yeni hesap açmak zorunda kalmazsınız."],
      ["Anahtar Kelime Araştırması Yapıyoruz", "Sektörünüzde insanlar Google'da ne arıyor, hangi kelime ucuz ve kaliteli, hangisi pahalı ama düşük dönüşüm getiriyor — doğru listeyle başlıyoruz."],
      ["Arama Ağı Kampanyalarını Kuruyoruz", "Genelde biri marka, diğeri kategori sorgularını yakalayan iki kampanyayla başlıyoruz; bütçe, hedefleme ve metinleri ayrı kuruyoruz."],
      ["Coğrafi Hedeflemeyi Ayarlıyoruz", "Reklamınız yalnızca hizmet verdiğiniz ilçelerde çıksın diye coğrafi ayarları inceden yapıyoruz; bütçeniz ilgisiz bölgelere gitmiyor."],
      ["Dönüşüm Takibini Entegre Ediyoruz", "Form, telefon, WhatsApp ve satış dönüşümlerini sayamadan reklamın işe yarayıp yaramadığını bilemeyiz; gelişmiş dönüşüm kurulumunu siteye entegre ediyoruz."],
      ["Negatif Kelime ve IP Engelleme", "İlgisiz aramalarda çıkmamak için negatif kelime listeleri, sahte tıklamalara karşı IP engelleme çalışması yapıyoruz."],
    ],
    faq: (c) => [
      [`${c.loc} Google Ads için ne kadar bütçe gerekir?`, "Reklam bütçesi sektöre ve rekabete göre değişir ve doğrudan Google'a ödenir. Aylık yönetim ücretimiz ise 5.000 TL'den başlar ve reklam bütçesinden ayrıdır."],
      ["Reklam hesabı kimin olur?", "Hesap her zaman sizin adınıza açılır ve size aittir. Sözleşme bittiğinde erişimimizi kaldırırız, sahiplik sizde kalır."],
      [`${c.loc} olmadan reklamı nasıl yönetiyorsunuz?`, "Google Ads tamamen çevrimiçi yönetilir. Hesabınıza yetkili olarak bağlanıp kampanyaları uzaktan kurar ve her gün optimize ederiz; Aydın merkezliyiz, Türkiye geneline hizmet veriyoruz."],
    ],
  },
};

/* ------------------------------------------------------------------ şablon */
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function page(svcKey, c) {
  const s = SERVICES[svcKey];
  const url = `${SITE}/${s.folder}/${c.slug}.html`;
  const otherSvc = SERVICES[s.other];
  const otherUrl = `../${otherSvc.folder}/${c.slug}.html`;

  const steps = s.steps
    .map(
      ([h, p], i) =>
        `    <h3>${i + 1}. ${esc(h)}</h3>\n    <p>${esc(p)}</p>`
    )
    .join("\n\n");

  const districts = c.districts
    .map((d) => `      <div class="card text-center"><h3 class="mb-0 h-sm">${esc(d)}</h3></div>`)
    .join("\n");

  const faqItems = s.faq(c);
  const faqHtml = faqItems
    .map(
      ([q, a]) =>
        `      <div class="card">\n        <h3 class="h-sm">${esc(q)}</h3>\n        <p>${esc(a)}</p>\n      </div>`
    )
    .join("\n");
  const faqLd = faqItems
    .map(
      ([q, a]) =>
        `    {"@type":"Question","name":${JSON.stringify(q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(a)}}}`
    )
    .join(",\n");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(s.title(c))} | Sponsorlu Reklam</title>
<meta name="description" content="${esc(s.desc(c))}">
<meta name="keywords" content="${esc(s.keywords(c))}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0a2540">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(s.title(c))} | Sponsorlu Reklam">
<meta property="og:description" content="${esc(s.desc(c))}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/og-image.png">
<meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(s.title(c))}">
<meta name="twitter:description" content="${esc(s.lead(c))}">
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
  "@type": "Service",
  "name": ${JSON.stringify(s.h1(c))},
  "serviceType": ${JSON.stringify(s.label)},
  "provider": { "@type": "ProfessionalService", "name": "Sponsorlu Reklam", "telephone": "+905468445576", "address": { "@type": "PostalAddress", "streetAddress": "Mimar Sinan Mah. 2341 Sk. No:4", "addressLocality": "Efeler", "addressRegion": "Aydın", "addressCountry": "TR" } },
  "areaServed": { "@type": "City", "name": ${JSON.stringify(c.name)} },
  "description": ${JSON.stringify(s.desc(c))},
  "offers": { "@type": "Offer", "price": "${s.price}", "priceCurrency": "TRY" }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Anasayfa", "item": "${SITE}/"},
    {"@type": "ListItem", "position": 2, "name": ${JSON.stringify(s.label)}, "item": "${SITE}/hizmetler/${s.folder}.html"},
    {"@type": "ListItem", "position": 3, "name": ${JSON.stringify(c.name)}, "item": "${url}"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
${faqLd}
  ]
}
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
    <div class="breadcrumb"><a href="../index.html">Anasayfa</a> / <a href="${s.mainPage}">${esc(s.label)}</a> / ${esc(c.name)}</div>
    <h1>${esc(s.h1(c))}</h1>
    <p>${esc(s.lead(c))}</p>
  </div>
</section>

<section class="section">
  <div class="container article-content">
    <h2>${esc(c.name)} İçin Neden Sponsorlu Reklam?</h2>
    <p>${esc(s.intro(c))}</p>
    <p>${esc(c.loc)} öne çıkan ${esc(c.sectors)} gibi işletmelerle çalışmaya hazırız. Aydın merkezli olmamız, ${esc(c.gen)} pazarını ve rekabetini yakından tanımamızı sağlıyor.</p>

    <h2>${esc(c.loc)} Sürecimiz Nasıl İşliyor?</h2>

${steps}
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">${esc(c.name)} ve İlçeleri</span>
      <h2>${esc(c.gen)} Her İlçesine Hizmet Veriyoruz</h2>
      <p>Uzaktan çalıştığımız için ${esc(c.name)} genelinde, tüm ilçelerde aynı kalitede hizmet veriyoruz.</p>
    </div>
    <div class="grid grid-4">
${districts}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">Sıkça Sorulanlar</span>
      <h2>${esc(c.name)} ${esc(s.label)} Hakkında</h2>
    </div>
    <div class="grid grid-3">
${faqHtml}
    </div>
    <div class="alert alert-info mt-4">
      <strong>${esc(otherSvc.label)} de mi lazım?</strong>
      ${esc(s.crossLead(c))} <a href="${otherUrl}">${esc(s.crossLabel(c))}</a> sayfasına göz atın.
    </div>
  </div>
</section>

<section class="cta-strip">
  <div class="container">
    <h2>${esc(c.loc)} Bir Sonraki Adımı Birlikte Atalım</h2>
    <p>15 dakikalık ücretsiz bir görüşmeyle mevcut durumunuzu konuşalım, ${esc(c.loc)} size en uygun çözümü birlikte bulalım.</p>
    <div class="hero-actions" style="justify-content:center;">
      <a href="https://wa.me/905468445576" class="btn btn-primary btn-lg">WhatsApp ile Yazın</a>
      <a href="../paketler.html" class="btn btn-outline btn-lg">Paket Detayları</a>
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

/* -------------------------------------------------------------------- main */
const root = __dirname;
let count = 0;
for (const svcKey of Object.keys(SERVICES)) {
  const dir = path.join(root, SERVICES[svcKey].folder);
  fs.mkdirSync(dir, { recursive: true });
  for (const c of CITIES) {
    const file = path.join(dir, `${c.slug}.html`);
    fs.writeFileSync(file, page(svcKey, c), "utf8");
    count++;
    console.log("yazıldı:", path.relative(root, file));
  }
}
console.log(`\nToplam ${count} sayfa üretildi.`);
