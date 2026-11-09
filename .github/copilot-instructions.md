# Kişisel portfolyo sitesi: Copilot talimatları

## Proje
Etkileşimli bir ASCII donut'un önünde duran, Türkçe bir kişisel portfolyo sitesi. Kitle: arkadaşlar, genel okuyucu ve işverenler. İşveren 30 saniyede kim olduğumu ve en iyi projelerimi görebilmeli; donut ve terminal şov katar ama içeriği gölgelemez.

Sitenin üstündeki menü çubuğunun ortasında tek satırlık sahte bir terminal var. Kullanıcı komut yazar, komut donut'un şeklini, rengini vb. değiştirir ya da bağlantı açar.

## Yığın
- Vite, React, TypeScript (strict)
- Tailwind CSS
- three, @react-three/fiber, @react-three/drei, ASCII efekti için özel shader (postprocessing ile)
- Zustand (paylaşılan donut ayarları)
- Motion (hafif içerik animasyonları)
- Vitest, ESLint, Prettier
- Veritabanı, sunucu ve giriş sistemi yok; site tamamen statik.
- Paket sürümlerini kurulumda güncel kararlı sürüme göre doğrula, bu dosyaya sabit sürüm yazma.

## Klasör yapısı
```text
src/
  commands/    komut kayıt defteri ve komutlar (arayüzden bağımsız)
  donut/       3D sahne, ASCII shader, şekiller
  store/       paylaşılan donut ayarları (Zustand)
  components/  menü, terminal arayüzü, kartlar
  sections/    Hero, Hakkımda, Projeler, Yetenekler, İletişim
  content/     projeler ve metinler (Türkçe, dosya olarak)
  config/      links.ts (tüm dış bağlantı adresleri tek yerde)
public/        görseller, favicon
```

## Dil
- Kullanıcıya görünen tüm metin Türkçe olur ve `src/content` veya komut sonuçlarında durur; bileşenlere gömülmez.
- Kod, değişken, dosya ve komut adları İngilizce kalır (`help`, `shape`, `color` gibi).
- Metinleri ileride İngilizce eklenebilecek şekilde ayrı tut.

## Komut sistemi
Komut motoru arayüzden bağımsızdır. Bir komut ekrana yazmaz, sonuç nesnesi döndürür; sonucu nasıl göstereceğine arayüz katmanı karar verir. Böylece bugünkü menü terminali ve ileride yapılacak tam ekran terminal aynı kayıt defterini kullanır.

```ts
type CommandResult = { status: 'ok' | 'error' | 'info'; message: string };

type Command = {
  name: string;
  aliases?: string[];
  description: string;
  run: (args: string[]) => CommandResult;
};
```

Başlangıç komutları:
- Gezinme: `help`, `about`, `projects`
- Bağlantı: `./cv`, `linkedin`, `github`, `email` (yeni sekmede, `noopener` ile açılır)
- Donut: `shape`, `color`, `speed`, `charset`, `reset`
- Terminal: `clear`
- Eğlence: `whoami`, `sudo`, `matrix`

Terminal davranışı:
- Tek satırdır; Enter'a basınca giriş temizlenir, sonuç kutunun altında 1-2 saniyelik geçici bildirim olarak görünür. Hiçbir şey birikmez.
- Bilinmeyen komutta kısa bir hata mesajı ve `help` ipucu gösterilir.
- `help` listesi kutunun altında açılan bir listedir; Esc, dışarı tıklama veya yeni tuşla kapanır.
- Hayalet metin otomatik tamamlama (Tab ile kabul), ok tuşlarıyla geçmiş (ekranda biriktirilmez), `/` ve `Ctrl+K` ile odaklanma.
- Mobilde terminal simgesine dokununca tam genişlikte panel açılır.
- `./cv` için CV sitesi henüz hazır değil: adres gelene kadar "yakında" bildirimi gösterir. Tüm dış bağlantı adresleri `src/config/links.ts` içinde tutulur.
- Her yeni komut için Vitest testi yazılır.

## Donut
- Gerçek bir 3D sahne düşük çözünürlüklü bir hedefe çizilir, her hücrenin parlaklığı bir shader ile karaktere çevrilir.
- Şekiller: torus (varsayılan), küre, küp, torus knot, ikosahedron. Yeni şekil bir geometri tanımı eklemektir.
- Ayarlar (şekil, renk, hız, boyut, karakter seti, ızgara yoğunluğu) Zustand deposunda durur. Komutlar depoya yazar, donut kare döngüsünde `getState()` ile okur.
- Etkileşim: fare konumu dönüşü etkiler, sürükleyince döner ve ataletle yavaşlar, tıklayınca dalga efekti çıkar, kaydırma hızı dönüşü etkiler.
- Kare döngüsünde React state güncelleme. Render döngüsü R3F'in `useFrame` ya da `requestAnimationFrame` üzerinden çalışır.
- Sekme gizliyken durur, mobilde ızgara seyreltilir, `prefers-reduced-motion` açıkken yavaşlar veya durur.
- 3D paket lazy-load edilir (dinamik `import()`); içerik donut'tan önce görünür. WebGL yoksa ya da yükleme başarısız olursa statik ASCII yedek gösterilir, site çalışmaya devam eder.
- Hero dışında donut düşük opaklıkta kalır; içerik kartlarının arkasında yarı saydam panel ve hafif bulanıklık kullanılır.

## Tasarım
- Koyu zemin, vurgu rengi camgöbeği ve tonları (açık, orta, koyu). Renkler CSS/Tailwind tema değişkenleri olarak tanımlanır, bileşenlere sabit renk yazılmaz.
- Başlıklarda ve terminalde monospace, uzun metinde okunaklı bir gövde yazı tipi.
- Numaralı bölümler, kısa cümleler, küçük sürprizler (referans: christendijoux.com, levo-studio.com).
- Gövde metni WCAG AA kontrastını (4.5:1) sağlar.
- Şov hero'da yapılır; diğer bölümlerde hareket hafif kalır.

## Erişilebilirlik ve performans
- Tüm bağlantılar ve terminal klavyeyle kullanılabilir, odak göstergesi görünür.
- Donut dekoratiftir (`aria-hidden`), terminal etiketlidir, bildirimler `aria-live` ile okunur.
- Mobil, her görevin bitiş kriterinin parçasıdır; geliştirirken dar ekranı da dene.
- Hedef: Lighthouse performans ve erişilebilirlik 90 üstü.
- Başlık, açıklama, Open Graph görseli ve favicon eklenir.

## Çalışma kuralları
- Tek seferde tek, küçük bir görev yap (bir bileşen, bir komut, bir şekil). İstenmeyen dosyalara dokunma.
- Büyük değişiklikten önce kısa bir plan çıkar ve onay iste.
- Onay almadan yeni bağımlılık ekleme; eklerken nedenini söyle.
- `any` kullanma, TypeScript strict kalır.
- Gizli bilgi (anahtar, şifre) repoya yazma.
- Anlaşılmayan yerde varsayım yapma, sor.

## Bitiş kriteri
Bir görev şu durumda bitmiş sayılır: `npm run build`, `npm run lint` ve `npm run test` hatasız geçer, değişiklik tarayıcıda denenmiştir (mobil görünüm dahil) ve commit mesajı değişikliği tek cümleyle anlatır.