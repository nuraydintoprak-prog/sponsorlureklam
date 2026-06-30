/**
 * Blog makalesi üreticisi — Sponsorlu Reklam
 * /blog/<slug>.html sayfalarını mevcut blog şablonuyla üretir.
 * Yeni makale eklemek için ARTICLES dizisine ekleyip `node build-blog.js` çalıştır.
 * Not: blog.html kartı, sitemap.xml ve llms.txt girişleri ayrıca elle eklenir
 * (script bunların kod parçalarını konsola yazdırır).
 *
 * ÖNEMLİ: Üretimden sonra `node build-inline-css.js` çalıştır — yeni sayfaların
 * CSS'ini gömer (LCP / kritik istek zinciri için gerekli).
 */
const fs = require("fs");
const path = require("path");
const SITE = "https://sponsorlureklam.com.tr";

const ARTICLES = [
  {
    slug: "performance-max-nedir",
    tag: "Google Ads",
    section: "Google Ads",
    crumb: "Performance Max",
    title: "Performance Max Kampanyaları Nedir, Ne Zaman Kullanılır?",
    h1: "Performance Max Kampanyaları Nedir?",
    desc: "Google'ın yapay zeka destekli Performance Max kampanya türü nedir, nasıl çalışır, hangi işletmeye uygun ve dikkat edilmesi gereken tuzaklar.",
    ogDesc: "Google'ın yapay zeka destekli kampanya türü PMax'i sade dille anlatıyoruz.",
    keywords: "performance max, pmax, google ads kampanya türleri, yapay zeka reklam, performance max nedir",
    readMin: 7,
    date: "2026-05-31",
    dateDisp: "31 Mayıs 2026",
    lead: "Google Ads'te \"Performance Max\" (kısaca PMax) son yılların en çok konuşulan kampanya türü. Tek kampanyayla Google'ın tüm reklam alanlarına çıkmanızı sağlıyor; ama yapay zekaya çok şey bıraktığı için doğru kurulmazsa bütçeyi de hızlı harcayabiliyor. Bu yazıda sade dille anlatıyoruz.",
    body: `
    <p>Klasik Google Ads kampanyalarında her şeyi siz seçersiniz: arama mı görüntülü mü, hangi anahtar kelime, hangi kitle, hangi yerleşim. Performance Max ise tersini yapar; siz hedefi (örneğin "dönüşüm getir") ve reklam malzemelerini verirsiniz, kanal dağıtımını Google'ın yapay zekası yönetir.</p>

    <h2>Performance Max Tam Olarak Nedir?</h2>
    <p>Performance Max, tek bir kampanyadan Google'ın <strong>tüm envanterine</strong> reklam veren bir kampanya türüdür: Arama, Görüntülü Reklam Ağı, YouTube, Gmail, Discover ve Haritalar. Yani <a href="arama-agi-mi-goruntulu-reklam-mi.html">arama ağı ile görüntülü reklam</a> arasında ayrı ayrı seçim yapmak yerine, hepsini tek çatı altında çalıştırırsınız ve Google hangi kanalın daha çok dönüşüm getireceğine otomatik karar verir.</p>

    <h2>Nasıl Çalışır?</h2>
    <p>PMax'e üç şey verirsiniz:</p>
    <ul>
      <li><strong>Hedef:</strong> Genelde dönüşüm (satış, form, arama) ya da dönüşüm değeri.</li>
      <li><strong>Öğeler (asset):</strong> Başlıklar, açıklamalar, görseller, logolar, videolar.</li>
      <li><strong>Kitle sinyalleri:</strong> "Bu kitle bizim için değerli" diyebileceğiniz ipuçları — zorunlu değil ama öğrenmeyi hızlandırır.</li>
    </ul>
    <p>Google bu malzemeleri farklı kanallarda farklı kombinasyonlarda dener, en çok dönüşüm getireni öne çıkarır. Bu yüzden <a href="donusum-takibi-kurmadan-reklam.html">dönüşüm takibi olmadan PMax çalıştırmak</a> neredeyse anlamsızdır; sistemin neyi optimize edeceğini bilmesi gerekir.</p>

    <h2>Hangi İşletmeye Uygun?</h2>
    <p>PMax şu durumlarda güçlüdür:</p>
    <ul>
      <li>Net bir dönüşüm hedefi olan (e-ticaret, randevu, teklif formu) işletmeler.</li>
      <li>Yeterli dönüşüm verisi üretebilen hesaplar — sistem öğrenmek için veri ister.</li>
      <li>Görsel ve video malzemesi sunabilen markalar.</li>
    </ul>
    <p>Buna karşılık çok düşük bütçeli, haftada birkaç dönüşüm bile alamayan yeni hesaplarda PMax "öğrenemeden" bütçe harcayabilir. Böyle durumlarda önce klasik <a href="../hizmetler/google-ads.html">Arama Ağı kampanyasıyla</a> sağlam bir temel kurmak daha doğrudur.</p>

    <h2>Dikkat Edilmesi Gereken Tuzaklar</h2>
    <ol>
      <li><strong>Şeffaflık azdır:</strong> Hangi aramada, nerede çıktığınızı klasik kampanyalar kadar net göremezsiniz. Raporlamayı dikkatli kurmak gerekir.</li>
      <li><strong>Marka trafiğini yiyebilir:</strong> PMax, sizi zaten adınızla arayanları "dönüşüm" gibi gösterip başarısını şişirebilir. Marka aramalarını ayırmak önemlidir.</li>
      <li><strong>Zayıf öğreler zayıf sonuç verir:</strong> Kötü görsel ve metin verirseniz yapay zeka da kötü reklam üretir. Malzeme kalitesi her şeydir.</li>
      <li><strong>Negatif kontrolü kısıtlıdır:</strong> <a href="negatif-anahtar-kelime-listesi.html">Negatif kelime</a> ekleme PMax'te daha sınırlıdır; bu yüzden hesap düzeyinde dışlamalar önem kazanır.</li>
    </ol>

    <h2>Sonuç</h2>
    <p>Performance Max, doğru kurulduğunda güçlü bir araç; ama "kur ve unut" sistemi değil. Sağlam dönüşüm takibi, kaliteli öğeler ve düzenli izleme olmadan yapay zekaya teslim olmak çoğu zaman bütçe kaybıyla sonuçlanır. Önce temeli kurar, veriyi biriktirir, sonra PMax'i o temelin üstüne ekleriz.</p>

    <p>Hesabınız için PMax'in doğru zaman olup olmadığını birlikte değerlendirelim mi? <a href="../rezervasyon.html">Görüşme rezervasyonu</a> alabilirsiniz.</p>`,
    cta: { h2: "PMax Sizin İçin Doğru mu?", p: "Hesabınızın verisine bakıp Performance Max'in işinize yarayıp yaramayacağını net söyleyelim." },
  },
  {
    slug: "remarketing-geri-donen-musteri",
    tag: "Strateji",
    section: "Strateji",
    crumb: "Remarketing",
    title: "Remarketing ile Geri Dönen Müşteri Kazanmak",
    h1: "Remarketing ile Geri Dönen Müşteri Kazanmak",
    desc: "Sitenizi ziyaret edip ayrılan kullanıcıyı yeniden yakalamanın yolu: remarketing. Mantığı, kurulum adımları, kitle türleri ve sık yapılan hatalar.",
    ogDesc: "Siteyi terk eden ziyaretçiyi yeniden yakalamanın yolu: remarketing.",
    keywords: "remarketing, yeniden pazarlama, retargeting, google ads remarketing, kitle listesi",
    readMin: 6,
    date: "2026-05-31",
    dateDisp: "31 Mayıs 2026",
    lead: "Sitenizi ziyaret eden her 100 kişiden belki 2-3'ü ilk seferde harekete geçer. Geri kalan 97 kişi öylece gider mi? Remarketing tam da bu noktada devreye girer: ilgilenip ayrılan kullanıcıyı yeniden karşınıza getirir.",
    body: `
    <p>Bir kullanıcı sitenize geldi, ürününüze baktı, fiyatı gördü ama satın almadan kapattı. Bu kişi tamamen kayıp değil; aslında en sıcak müşteri adaylarınızdan biri. Çünkü sizi tanıyor, ihtiyacı var, sadece o an karar vermedi. Remarketing (yeniden pazarlama), bu kişiyi gezdiği diğer sitelerde, YouTube'da veya yeni bir aramada tekrar yakalayıp geri çağırmaktır.</p>

    <h2>Remarketing Nasıl Çalışır?</h2>
    <p>Temel mantık şudur: sitenizi ziyaret edenler bir "kitle listesine" eklenir, sonra reklamlarınız sadece o listedeki kişilere gösterilir. Bunun için sitenizde bir izleme etiketi (genelde <a href="google-analytics-4-donusum-takibi.html">Google Analytics 4</a> veya Google Ads etiketi) bulunması gerekir. Etiket, ziyaretçileri anonim biçimde işaretler ve listeleri besler.</p>

    <h2>Hangi Kitleleri Oluşturabilirsiniz?</h2>
    <ul>
      <li><strong>Tüm ziyaretçiler:</strong> Son 30/60/90 günde siteye gelen herkes.</li>
      <li><strong>Belirli sayfayı görenler:</strong> Örneğin fiyat sayfasına bakıp ayrılanlar — niyeti yüksek kitle.</li>
      <li><strong>Dönüşüme yaklaşıp tamamlamayanlar:</strong> Formu açıp göndermeyen, sepete ekleyip almayanlar.</li>
      <li><strong>Mevcut müşteriler:</strong> Onlara farklı (veya hiç) reklam göstermek için ayrılır.</li>
    </ul>
    <p>Kitleyi ne kadar niyet odaklı kurarsanız, dönüşüm o kadar artar. "Fiyatı görüp ayrılan" biri, "anasayfaya 2 saniye bakıp çıkan" birinden çok daha değerlidir.</p>

    <h2>Remarketing'i Etkili Kılan Detaylar</h2>
    <ol>
      <li><strong>Sıklık sınırı koyun:</strong> Aynı reklamı günde 10 kez gören kullanıcı rahatsız olur. Gösterim sıklığını sınırlayın.</li>
      <li><strong>Mesajı bağlama oturtun:</strong> Ürüne bakıp ayrılana o ürünü/teklifi hatırlatın, genel marka reklamı değil.</li>
      <li><strong>Doğru açılış sayfasına yollayın:</strong> Reklamı tıklayan, baktığı yere dönmeli. <a href="landing-page-nedir.html">Açılış sayfası</a> uyumu dönüşümü belirler.</li>
      <li><strong>Süreyi ürününüze göre ayarlayın:</strong> Hızlı kararlar için kısa pencere (7-14 gün), uzun karar süreçleri için daha geniş pencere.</li>
    </ol>

    <h2>Sık Yapılan Hatalar</h2>
    <ul>
      <li><strong>Dönüşenleri listeden çıkarmamak:</strong> Zaten satın alana aynı reklamı göstermek bütçe israfıdır.</li>
      <li><strong>Tek bir dev liste kullanmak:</strong> Herkese aynı mesaj = düşük dönüşüm. Niyete göre ayırın.</li>
      <li><strong>Yetersiz liste boyutu:</strong> Çok küçük listeler reklam göstermek için yeterli kişiye ulaşamaz; trafiğin belli bir hacme ulaşması gerekir.</li>
    </ul>

    <h2>Sonuç</h2>
    <p>Remarketing, yeni müşteri aramaktan daha ucuza, sizi zaten tanıyan sıcak kitleyi geri getirir. Doğru kurulmuş bir <a href="donusum-takibi-kurmadan-reklam.html">dönüşüm takibi</a> ve niyet odaklı kitlelerle, aynı bütçeden çok daha fazla iş çıkarmanın en pratik yollarından biridir. Yeni başlayan reklam hesaplarında bile, ilk trafiği topladıktan sonra kurulması gereken bir katmandır.</p>

    <p>Sitenizin remarketing altyapısını kurmamızı ister misiniz? <a href="../rezervasyon.html">Görüşme rezervasyonu</a> alabilirsiniz.</p>`,
    cta: { h2: "Geri Dönen Müşteriyi Kaçırmayın", p: "Remarketing kitlelerinizi ve dönüşüm takibinizi sektörünüze özel kuralım." },
  },
  {
    slug: "kalite-puani-nasil-yukseltilir",
    tag: "Optimizasyon",
    section: "Optimizasyon",
    crumb: "Kalite Puanı",
    title: "Google Ads Kalite Puanı Nasıl Yükseltilir?",
    h1: "Google Ads Kalite Puanı Nasıl Yükseltilir?",
    desc: "Kalite Puanı tıklama maliyetinizi doğrudan etkiler. Puanı oluşturan üç bileşen, yükseltme yöntemleri ve düşük puanın gerçek maliyeti.",
    ogDesc: "Kalite Puanı tıklama maliyetinizi etkiler; nasıl yükseltilir?",
    keywords: "kalite puanı, quality score, google ads kalite puanı, tıklama maliyeti, cpc düşürme",
    readMin: 7,
    date: "2026-05-31",
    dateDisp: "31 Mayıs 2026",
    lead: "Aynı anahtar kelimeye iki işletme reklam veriyor; biri tıklama başına 8 TL, diğeri 4 TL ödüyor ve üstelik daha üstte çıkıyor. Aradaki fark çoğu zaman Kalite Puanı'dır. Bu yazıda puanı neyin belirlediğini ve nasıl yükselteceğinizi anlatıyoruz.",
    body: `
    <p>Kalite Puanı (Quality Score), Google'ın 1-10 arası verdiği bir nottur ve anahtar kelimenizin ne kadar "alakalı ve kaliteli" olduğunu özetler. Önemi şuradan gelir: puan yükseldikçe aynı pozisyon için daha az ödersiniz. Yani Kalite Puanı, doğrudan <strong>tıklama maliyetinizi (CPC)</strong> etkileyen bir kaldıraçtır.</p>

    <h2>Kalite Puanını Oluşturan 3 Bileşen</h2>
    <h3>1. Beklenen Tıklama Oranı (CTR)</h3>
    <p>Google, reklamınızın tıklanma olasılığını tahmin eder. Geçmiş performansınız iyiyse puan yükselir. Bu yüzden <a href="ctr-tiklama-orani-nasil-artirilir.html">tıklama oranını artırmak</a> doğrudan Kalite Puanını da besler.</p>
    <h3>2. Reklam Alaka Düzeyi</h3>
    <p>Reklam metniniz, hedeflediğiniz anahtar kelimeyle ne kadar örtüşüyor? Birisi "Aydın diş kliniği" arıyorsa, reklam başlığında bu ifadenin geçmesi alaka düzeyini yükseltir. <a href="reklam-metni-yazarken-7-altin-kural.html">Reklam metni yazımı</a> burada kritik rol oynar.</p>
    <h3>3. Açılış Sayfası Deneyimi</h3>
    <p>Tıklayan kullanıcı nasıl bir sayfaya düşüyor? Sayfa aradığı şeyi sunuyor mu, hızlı açılıyor mu, mobilde düzgün mü? <a href="kurumsal-site-acilis-hizi.html">Yavaş açılan bir sayfa</a> veya <a href="../hizmetler/web-tasarim.html">dönüşüme uygun olmayan bir tasarım</a> puanı aşağı çeker.</p>

    <h2>Puanı Yükseltmek İçin Pratik Adımlar</h2>
    <ol>
      <li><strong>Reklam gruplarını sıkılaştırın:</strong> Bir grupta 50 alakasız kelime yerine, birbirine yakın az sayıda kelime olsun. Böylece tek bir net reklam metni yazabilirsiniz.</li>
      <li><strong>Anahtar kelimeyi metne taşıyın:</strong> Hedef kelimeyi başlıkta ve açıklamada kullanın; alaka düzeyi anında artar.</li>
      <li><strong>Açılış sayfasını eşleştirin:</strong> Reklam neyi vaat ediyorsa sayfa onu göstersin. Genel anasayfaya değil, ilgili sayfaya yollayın.</li>
      <li><strong>Sayfa hızını düzeltin:</strong> Özellikle mobilde. Hız, hem kullanıcı hem Google için kalite sinyalidir.</li>
      <li><strong>Negatif kelimelerle alakasız tıklamayı kesin:</strong> <a href="negatif-anahtar-kelime-listesi.html">Negatif liste</a> CTR'yi korur, dolaylı olarak puanı yükseltir.</li>
    </ol>

    <h2>Düşük Kalite Puanının Gerçek Maliyeti</h2>
    <blockquote>Kalite Puanı 3 olan bir kelime, Puanı 8 olan bir rakibe göre aynı pozisyon için kabaca iki katı tıklama maliyeti ödeyebilir. Yani düşük puan, görünmez bir "ceza vergisi" gibidir; her tıklamada fazladan ödersiniz.</blockquote>
    <p>Bu yüzden bütçeyi artırmadan sonuç iyileştirmek isteyen çoğu hesapta, ilk bakılacak yer Kalite Puanıdır. Puanı 2 basamak yükseltmek, çoğu zaman bütçeyi %20 artırmaktan daha fazla iş getirir.</p>

    <h2>Sonuç</h2>
    <p>Kalite Puanı bir "vanity metric" (gösteriş metriği) değil; doğrudan paranızı etkileyen bir ölçüdür. Alakalı reklam grupları, kelimeyle uyumlu metinler ve hızlı, ilgili açılış sayfaları üçlüsünü kurduğunuzda puan yükselir, tıklama maliyeti düşer ve aynı bütçe daha çok dönüşüme dönüşür.</p>

    <p>Hesabınızın Kalite Puanı dökümünü çıkarıp zayıf noktaları bulalım mı? <a href="../rezervasyon.html">Görüşme rezervasyonu</a> alabilirsiniz.</p>`,
    cta: { h2: "Aynı Bütçeyle Daha Fazla Tıklama", p: "Kalite Puanınızı yükseltip tıklama maliyetinizi düşürelim — bütçeyi artırmadan." },
  },
  {
    slug: "google-isletme-profili-yerel-seo",
    tag: "Yerel Reklam",
    section: "Yerel Reklam",
    crumb: "İşletme Profili",
    title: "Google İşletme Profili ile Yerel Müşteri Çekmek",
    h1: "Google İşletme Profili ile Yerel Müşteri Çekmek",
    desc: "Google Haritalar ve yerel aramalarda öne çıkmanın ücretsiz yolu: Google İşletme Profili. Kurulum, optimizasyon, yorum yönetimi ve reklamla ilişkisi.",
    ogDesc: "Haritalar ve yerel aramada öne çıkmanın ücretsiz yolu: İşletme Profili.",
    keywords: "google işletme profili, google haritalar, yerel seo, google my business, harita sıralaması",
    readMin: 6,
    date: "2026-05-31",
    dateDisp: "31 Mayıs 2026",
    lead: "Birisi telefonundan \"yakınımdaki diş kliniği\" ya da \"Aydın oto servis\" aradığında çıkan harita kutusu — işte yerel işletmeler için altın değerindeki o alan. Oraya çıkmanın yolu reklam değil, ücretsiz bir Google İşletme Profili'dir.",
    body: `
    <p>Google İşletme Profili (eski adıyla Google My Business), işletmenizi Google Haritalar'da ve yerel aramalarda görünür kılan ücretsiz bir araçtır. Reklam vermeden, sadece doğru kurup besleyerek, bulunduğunuz bölgedeki aramalarda öne çıkabilirsiniz. <a href="yerel-isletmeler-icin-cografi-hedefleme.html">Coğrafi hedefleme</a> reklamın yerel ayağıysa, İşletme Profili de organik (ücretsiz) yerel ayağıdır.</p>

    <h2>Neden Bu Kadar Önemli?</h2>
    <p>Yerel aramalarda Google çoğu zaman sonuçların en üstüne bir harita ve 3 işletme gösterir (yerel paket). Kullanıcıların büyük kısmı tıklamasını buradan yapar. Bu alana çıkmak, klasik organik sıralamadan bile değerli olabilir — çünkü hem görünür hem de telefon, yol tarifi, yorum gibi aksiyonları tek dokunuşla sunar.</p>

    <h2>Profili Doğru Kurmanın Adımları</h2>
    <ol>
      <li><strong>Sahipliği doğrulayın:</strong> Profili oluşturup adres/telefon doğrulamasını tamamlayın. Doğrulanmamış profil tam görünmez.</li>
      <li><strong>Bilgileri eksiksiz girin:</strong> Kategori, çalışma saatleri, telefon, web sitesi, hizmet bölgesi — hepsi dolu olsun. Eksik profil daha az çıkar.</li>
      <li><strong>Doğru kategori seçin:</strong> Ana kategoriniz işinizi net tanımlasın; yanlış kategori yanlış aramalarda çıkmanıza yol açar.</li>
      <li><strong>Görsel ekleyin:</strong> Dış cephe, iç mekân, ekip, iş örnekleri. Görselli profiller belirgin biçimde daha çok tıklanır.</li>
      <li><strong>Web sitesini bağlayın:</strong> Profilden sitenize gelen trafik, hem dönüşüm hem güven için önemli. <a href="../hizmetler/web-tasarim.html">Mobil uyumlu bir site</a> bu trafiği boşa harcamamanızı sağlar.</li>
    </ol>

    <h2>Yorumlar: Yerel Sıralamanın Yakıtı</h2>
    <p>Yorum sayısı ve ortalama puan, hem sıralamayı hem de tıklanma oranını etkiler. Memnun müşterilerden düzenli olarak yorum isteyin ve <strong>her yoruma yanıt verin</strong> — olumluya teşekkür, olumsuza yapıcı ve çözüm odaklı. Yanıt veren işletmeler hem Google'a hem de potansiyel müşteriye "buradayız, ilgileniyoruz" mesajı verir.</p>
    <blockquote>Önemli: Yorumları satın almak veya sahte yorum yazdırmak Google politikalarına aykırıdır ve profilinizin askıya alınmasına yol açabilir. Gerçek müşteriden gelen gerçek yorum, her zaman en sağlam yoldur.</blockquote>

    <h2>İşletme Profili ile Reklam Birlikte Çalışır</h2>
    <p>İkisi rakip değil, tamamlayıcıdır. İşletme Profili sizi organik olarak haritada gösterir; Google Ads ise aramaların en üstünde ve daha geniş bölgelerde görünmenizi sağlar. Özellikle yeni işletmeler için ikisini birlikte kullanmak en hızlı sonucu verir. Bölgenize özel reklam yaklaşımımızı <a href="../google-ads/aydin.html">Aydın</a>, <a href="../google-ads/izmir.html">İzmir</a>, <a href="../google-ads/denizli.html">Denizli</a>, <a href="../google-ads/mugla.html">Muğla</a> ve <a href="../google-ads/antalya.html">Antalya</a> sayfalarımızda anlatıyoruz.</p>

    <h2>Sonuç</h2>
    <p>Google İşletme Profili, yerel bir işletmenin yapabileceği en yüksek getirili ücretsiz işlerden biridir. Eksiksiz bilgi, gerçek görseller ve düzenli yorum yönetimiyle, bölgenizdeki aramalarda reklam vermeden bile öne çıkarsınız. Reklamla birleştirdiğinizde ise yerel pazarda görünmediğiniz yer kalmaz.</p>

    <p>İşletme Profilinizi ve yerel reklam stratejinizi birlikte kuralım mı? <a href="../rezervasyon.html">Görüşme rezervasyonu</a> alabilirsiniz.</p>`,
    cta: { h2: "Yerel Aramalarda Öne Çıkın", p: "İşletme Profili kurulumu ve yerel Google Ads ile bölgenizde görünür olun." },
  },
];

function articleHtml(a) {
  const url = `${SITE}/blog/${a.slug}.html`;
  const iso = `${a.date}T09:00:00+03:00`;
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${a.title}</title>
<meta name="description" content="${a.desc}">
<meta name="keywords" content="${a.keywords}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="Sponsorlu Reklam">
<meta name="theme-color" content="#0a2540">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${a.h1}">
<meta property="og:description" content="${a.ogDesc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/og-image.png">
<meta property="og:locale" content="tr_TR">
<meta property="article:published_time" content="${iso}">
<meta property="article:section" content="${a.section}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${a.h1}">
<meta name="twitter:description" content="${a.ogDesc}">
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
    <div class="breadcrumb"><a href="../index.html">Anasayfa</a> / <a href="../blog.html">Blog</a> / ${a.crumb}</div>
    <h1>${a.h1}</h1>
    <p>${a.lead}</p>
  </div>
</section>

<section class="section">
  <div class="container article-content">
    <p class="article-meta">${a.dateDisp} · ${a.readMin} dk okuma · <a href="../blog.html">← Tüm Yazılar</a></p>
${a.body}
  </div>
</section>

<section class="cta-strip">
  <div class="container">
    <h2>${a.cta.h2}</h2>
    <p>${a.cta.p}</p>
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

const root = __dirname;
for (const a of ARTICLES) {
  fs.writeFileSync(path.join(root, "blog", `${a.slug}.html`), articleHtml(a), "utf8");
  console.log("yazıldı: blog/" + a.slug + ".html");
}

// blog.html kartları, sitemap ve llms.txt için kod parçaları
console.log("\n===== BLOG.HTML KARTLARI =====");
console.log(ARTICLES.map((a) => `      <article class="card">
        <span class="tag tag-gold">${a.tag}</span>
        <h3 class="mt-3"><a href="blog/${a.slug}.html" style="color:inherit;">${a.h1}</a></h3>
        <p class="article-meta">${a.dateDisp} · ${a.readMin} dk okuma</p>
        <p>${a.ogDesc}</p>
        <a href="blog/${a.slug}.html" class="btn btn-ghost mt-3">Yazıyı Oku</a>
      </article>`).join("\n\n"));

console.log("\n===== SITEMAP =====");
console.log(ARTICLES.map((a) => `  <url>
    <loc>${SITE}/blog/${a.slug}.html</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n"));

console.log("\n===== LLMS.TXT =====");
console.log(ARTICLES.map((a) => `- [${a.h1}](${SITE}/blog/${a.slug}.html)`).join("\n"));
