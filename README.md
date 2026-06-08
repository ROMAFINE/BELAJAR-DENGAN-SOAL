# LinguaRank Academy

Website belajar bahasa Inggris adaptif untuk English Basic, Foundation, IELTS, dan SAT English.

Versi ini dibuat static/client-side supaya bisa langsung diupload ke GitHub Pages. Semua login, data peserta, soal tambahan admin, progres, poin, dan leaderboard tersimpan di browser memakai `localStorage`.

## File penting

- `index.html` - struktur halaman aplikasi.
- `styles.css` - desain, responsive layout, dashboard, latihan, admin panel.
- `script.js` - semua logic aplikasi, login, password admin, data peserta, soal, poin, leaderboard, dan localStorage.
- `assets/learning-dashboard-hero.png` - aset visual utama.

## Cara buka lokal

Double-click `index.html`.

## Upload ke GitHub Pages

1. Buka GitHub dan buat repository baru.
2. Upload isi folder project ini:
   - `index.html`
   - `styles.css`
   - `script.js`
   - folder `assets/`
   - `.gitignore`
   - `README.md`
3. Masuk ke repo GitHub.
4. Buka `Settings` > `Pages`.
5. Pada `Build and deployment`, pilih `Deploy from a branch`.
6. Pilih branch `main` dan folder `/root`.
7. Tunggu GitHub memberi link Pages.

## Password admin

Password admin ada di `script.js`:

```js
const ADMIN_PASSWORD = "ILOVEYOU";
```

Karena ini static frontend, password tersebut bisa dilihat orang melalui source code browser. Versi ini cocok untuk prototipe/demo, bukan sistem publik yang benar-benar aman.

## Catatan data

- Data peserta tersimpan di browser masing-masing.
- Leaderboard juga tersimpan di browser, bukan server global.
- Jika peserta buka dari HP lain/browser lain, data tidak otomatis ikut pindah.
- Untuk leaderboard global sungguhan dan password yang tidak bocor, perlu backend/database.
