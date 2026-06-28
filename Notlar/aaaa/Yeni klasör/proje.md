Geliştirdiğin tüm bu yetenekleri (HTML, CSS, JS, Bootstrap, jQuery) tek bir çatı altında birleştiren, hem portfolyona koyabileceğin hem de gerçek bir SaaS (yazılım servisi) ürününe dönüşebilecek devasa bir proje promptu aşağıdadır.

Bu promptu yapay zeka araçlarına (veya kendine bir yol haritası olarak) vererek adım adım kodlamaya başlayabilirsin:

---

### Proje Promptu: "Devasa Responsive SaaS Dashboard ve Görev Yönetim Platformu"

**Rol:** Kıdemli Frontend Geliştirici

**Amaç:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 ve jQuery teknolojilerinin tamamını en efektif ve modern şekilde kullanan; veri analitiği, kullanıcı yönetimi ve dinamik etkileşimler içeren kurumsal düzeyde bir **"SaaS Yönetim Paneli (Dashboard)"** arayüzü geliştirmek.

#### 1. Proje Mimarisi ve Sayfa Yapısı (HTML5)

* **Semantik Yapı:** Tüm proje `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` ve `<footer>` etiketleri kullanılarak SEO ve erişilebilirlik (A11y) standartlarına uygun şekilde kurulmalıdır.
* **Sayfa Düzeni:** Sol tarafta daralıp açılabilen bir yan menü (`<aside>`), üst kısımda bildirim ve profil alanı (`<header>`), orta kısımda ise dinamik içerik alanı (`<main>`) yer almalıdır.

#### 2. Görsel Tasarım ve Modern Dokunuşlar (CSS3)

* **Modern Efektler:** Kartlar ve açılır pencereler için `box-shadow` ve `backdrop-filter: blur()` (glassmorphism) kullanılmalıdır. Görseller için `object-fit: cover` ve `aspect-ratio` tercih edilmelidir.
* **Responsive:** Grid ve Flexbox altyapısı kullanılarak `clamp()` ve `@media` sorguları ile mobil, tablet ve 2K ekranlara kusursuz uyum sağlanmalıdır.
* **Kullanıcı Deneyimi:** Sayfa geçişlerinde ve hover (üzerine gelme) efektlerinde `transition` ve `@keyframes` animasyonları ile yumuşak geçişler yapılmalıdır. `scroll-behavior: smooth` aktif edilmelidir.

#### 3. Arayüz ve Komponentler (Bootstrap 5)

* **Grid Sistemi:** Sayfa içindeki analitik kartlar, grafik alanları ve tablolar Bootstrap'in `row`, `col-md-*`, `g-4` sınıflarıyla dizilmelidir.
* **Hazır Komponentler:** Canlı form alanları için `form-control` ve `form-select`, veri bildirimleri için `alert`, profil ve veri grupları için `card` yapısı kullanılmalıdır.
* **Dinamik Öğeler:** Sıkça sorulan sorular için `accordion`, detaylı işlem pencereleri için Bootstrap `modal` komponentleri entegre edilmelidir.

#### 4. Dinamik Efektler ve DOM Manipülasyonu (jQuery)

* **Etkinlik Yönetimi:** Yan menünün daralıp açılması (`.slideToggle()` veya `.animate()`), karanlık mod (dark mode) geçişi (`.toggleClass()`) jQuery ile yazılmalıdır.
* **Form ve Tablo Etkileşimi:** Tablo içindeki verilerin anlık aranması/filtrelenmesi ve form input değerlerinin (`.val()`) anlık kontrolü jQuery etkinlikleri (`.on('keyup')`, `.change()`) ile yapılmalıdır.

#### 5. Modern Mantık ve API Entegrasyonu (JavaScript ES6+)

* **Veri Yönetimi:** API'den gelen simüle edilmiş veriler (veya ücretsiz bir Mock API) modern `fetch()` ve `async/await` mimarisi kullanılarak asenkron olarak çekilmelidir.
* **Dizi İşlemleri:** Gelen veriler `map()`, `filter()` ve `forEach()` metotları ile işlenerek HTML şablonlarına (Template Literals kullanarak) dinamik olarak basılmalıdır.
* **Durum (State) Yönetimi:** Kullanıcının seçtiği Dark Mode durumu veya sepet/görev listesi verileri `localStorage` üzerinde `JSON.stringify()` ile saklanmalı, sayfa yenilendiğinde `JSON.parse()` ile geri yüklenmelidir. `Optional Chaining (?.)` kullanılarak null/undefined hataları engellenmelidir.

**Çıktı Beklentisi:** Tamamen responsive, tek bir `.html` dosyası (veya modüler olarak ayrılmış `style.css` ve `app.js`) içinde çalışan, tarayıcıda hatasız çalışan, canlı ve üretime hazır (production-ready) frontend kodu.