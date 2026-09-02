# Otomatik Makale Üretimi (AI taslak + insan onayı)

Bu sistem, belirli aralıklarla **Claude API** ile bir blog makalesi **taslağı** üretir,
bir **Pull Request** açar; sen inceleyip onaylayınca (merge) **Netlify/Cloudflare Pages**
otomatik deploy eder. Yayın kararı her zaman sende — hiçbir şey onaysız yayınlanmaz.

## Akış

```
GitHub Actions (haftalık cron / elle)
  → scripts/keyword-research.js  (DataForSEO'dan gerçek arama hacmi çeker — konu elle verilmediyse)
  → scripts/draft-article.js  (Claude API ile, hacme göre seçilen konuda taslak üretir)
  → blog/<slug>.html + blog.html + sitemap.xml + llms.txt günceller, CSS gömer
  → Pull Request açar (hedef anahtar kelime + arama hacmi PR açıklamasında)
        → SEN incele / düzenle / merge et   (veya kapat = yayınlanmaz)
        → Netlify/Cloudflare push'u görür → otomatik deploy
```

## Parçalar

| Dosya | Görevi |
|---|---|
| `scripts/keyword-research.js` | DataForSEO API'den gerçek aylık arama hacmi verisiyle anahtar kelime adayları çeker, mevcut yazılarla çakışanları eler, `data/keyword-candidates.json` yazar |
| `scripts/draft-article.js` | Claude API'yi `fetch` ile çağırır (SDK/bağımlılık yok); konu elle verilmediyse en yüksek hacimli anahtar kelime adayını kullanır, JSON makale üretir |
| `lib/article.js` | Makale şablonu + siteye yerleştirme (blog/sitemap/llms + CSS gömme) |
| `.github/workflows/article-draft.yml` | Zamanlama (Pazartesi 09:00 TR) + elle tetik + PR açma |
| `data/keyword-history.json` | Daha önce hedeflenen anahtar kelimeler (tekrar önerilmesin diye) |

## Kurulum (tek seferlik)

1. **Projeyi GitHub'a koy.** Proje şu an git deposu değil:
   ```
   git init && git add . && git commit -m "ilk commit"
   git branch -M main
   git remote add origin https://github.com/<kullanıcı>/<repo>.git
   git push -u origin main
   ```
2. **Netlify/Cloudflare Pages'i bu repoya bağla.** (Muhtemelen zaten bağlı.)
   - Build command: yok (statik site) · Publish directory: kök (`/`)
   - `main`'e her push'ta otomatik deploy.
3. **API anahtarlarını secret olarak ekle:** GitHub repo → Settings → Secrets and variables
   → Actions → **New repository secret**:
   - `ANTHROPIC_API_KEY` = `sk-ant-...` (https://console.anthropic.com; her makale ~1 Opus çağrısı kadar ücretlidir)
   - `DATAFORSEO_LOGIN` ve `DATAFORSEO_PASSWORD` = dataforseo.com'da ücretsiz hesap açıp panelden alınan
     API kimlik bilgileri (Google Ads hesabı GEREKMEZ — sadece arama hacmi verisi için, ücretlendirme
     kullandıkça, ~1000 kelime sorgusu birkaç kuruş).

## Kullanım

- **Otomatik:** Her Pazartesi çalışır, PR açar.
- **Elle (konu vererek):** GitHub → Actions → "Haftalık AI makale taslağı" → **Run workflow**
  → istersen "Makale konusu" gir → Run. PR birkaç dakikada açılır.
- **Yerelde (test):**
  ```
  DATAFORSEO_LOGIN=... DATAFORSEO_PASSWORD=... node scripts/keyword-research.js --list   # sadece adayları gör
  ANTHROPIC_API_KEY=sk-ant-... node scripts/draft-article.js "Remarketing kitleleri nasıl kurulur"
  ```
  Dosyalar yerelde güncellenir; `git diff` ile incele, beğenirsen commit/push et.

## Yayın öncesi kontrol (PR'da)

AI içeriği **mutlaka** gözden geçir:
- Bilgiler doğru mu, halüsinasyon/yanlış rakam var mı? (Ajans güvenilirliği için kritik)
- İç linkler gerçek sayfalara mı gidiyor?
- Başlık/meta uzunlukları makul mü, marka sesi tutuyor mu?

Uygunsa **merge** → canlıya çıkar. Uygun değilse PR'da düzelt ya da **kapat** (yayınlanmaz).

## Notlar

- Script **taslak** üretir; tam otomatik yayın bilinçli olarak yapılmaz (SEO/marka riski + Google'ın
  "scaled content abuse" politikası). İnsan onayı zincirin parçasıdır.
- Tasarım şablonu hem `lib/article.js` hem `build-blog.js` içinde var; tasarım değişirse ikisini de güncelle.
- Yeni makale eklendiğinde Search Console'dan o URL için "Dizine eklenmeyi iste" demeyi unutma.
