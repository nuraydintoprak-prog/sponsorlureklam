# Otomatik Makale Üretimi (AI taslak + insan onayı)

Bu sistem, belirli aralıklarla **Claude API** ile bir blog makalesi **taslağı** üretir,
bir **Pull Request** açar; sen inceleyip onaylayınca (merge) **Netlify/Cloudflare Pages**
otomatik deploy eder. Yayın kararı her zaman sende — hiçbir şey onaysız yayınlanmaz.

## Akış

```
GitHub Actions (haftalık cron / elle)
  → scripts/draft-article.js  (Claude API ile taslak üretir)
  → blog/<slug>.html + blog.html + sitemap.xml + llms.txt günceller, CSS gömer
  → Pull Request açar
        → SEN incele / düzenle / merge et   (veya kapat = yayınlanmaz)
        → Netlify/Cloudflare push'u görür → otomatik deploy
```

## Parçalar

| Dosya | Görevi |
|---|---|
| `scripts/draft-article.js` | Claude API'yi `fetch` ile çağırır (SDK/bağımlılık yok), JSON makale üretir |
| `lib/article.js` | Makale şablonu + siteye yerleştirme (blog/sitemap/llms + CSS gömme) |
| `.github/workflows/article-draft.yml` | Zamanlama (Pazartesi 09:00 TR) + elle tetik + PR açma |

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
3. **API anahtarını secret olarak ekle:** GitHub repo → Settings → Secrets and variables
   → Actions → **New repository secret** → ad: `ANTHROPIC_API_KEY`, değer: `sk-ant-...`
   (Anahtarı https://console.anthropic.com adresinden alırsın; her makale ~1 Opus çağrısı kadar ücretlidir.)

## Kullanım

- **Otomatik:** Her Pazartesi çalışır, PR açar.
- **Elle (konu vererek):** GitHub → Actions → "Haftalık AI makale taslağı" → **Run workflow**
  → istersen "Makale konusu" gir → Run. PR birkaç dakikada açılır.
- **Yerelde (test):**
  ```
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
