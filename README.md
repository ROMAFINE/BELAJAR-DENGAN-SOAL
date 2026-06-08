# LinguaRank Academy

Prototype website belajar bahasa Inggris adaptif untuk English Foundation, IELTS, dan SAT English. Project ini dibuat dari blueprint `Website Belajar Bahasa Inggris, IELTS, dan SAT`.

## Isi project

- `index.html` - struktur aplikasi single-page.
- `styles.css` - layout responsive, dashboard, latihan, arena, admin preview.
- `script.js` - login, tes penempatan mini, lock track berbasis poin, practice engine, review, leaderboard.
- `server.js` - server Node.js tanpa dependency untuk auth aman, hash password, penyimpanan peserta, dan leaderboard.
- `tools/hash-password.js` - helper membuat hash password admin untuk deploy publik.
- `assets/learning-dashboard-hero.png` - aset visual lokal hasil generate untuk tampilan utama.

## Cara menjalankan

Untuk demo lokal tanpa server, `index.html` masih bisa dibuka langsung, tetapi admin aman tidak aktif.

Untuk mode publik/aman, jalankan server:

```powershell
$env:ADMIN_PASSWORD='ganti-password-admin-yang-kuat'
node server.js
```

Lalu buka `http://localhost:3000`.

Untuk deploy publik tanpa menyimpan password asli di environment, buat hash:

```powershell
node tools/hash-password.js "password-admin-kuat"
```

Set hasilnya sebagai environment variable:

```powershell
$env:ADMIN_PASSWORD_SALT='hasil_salt'
$env:ADMIN_PASSWORD_HASH='hasil_hash'
node server.js
```

## Fitur MVP

- Login awal sebagai Peserta atau Admin.
- Pada mode server, password admin dan peserta diverifikasi di backend; frontend tidak menyimpan password admin.
- Data peserta tersimpan di `data/participants.json` pada mode server. Pada demo file lokal, data fallback masih memakai `localStorage`.
- Peserta langsung masuk Tes Awal untuk menentukan jalur belajar.
- Dashboard level, poin, akses track, rekomendasi belajar, dan confidence meter.
- English Basic untuk pemula total: alfabet, bunyi dasar, kosakata harian, kalimat pendek, dan bridge ke Foundation.
- Tes penempatan mini dengan diagnosis level dan rekomendasi track.
- Jika hasil tes masih pemula, soal lanjutan terkunci dan hanya Basic yang terbuka sampai poin cukup.
- Foundation terbuka setelah 100 poin untuk jalur Basic; IELTS/SAT terbuka setelah 260 poin.
- Halaman Hasil/Penilaian terpisah untuk melihat skor, level, jawaban benar, dan breakdown skill.
- Practice page dengan filter Basic, Foundation, IELTS, SAT.
- Pembahasan reasoning, alasan opsi salah, dan poin berdasarkan difficulty.
- Jawaban salah bernilai 0 poin; poin hanya bertambah saat jawaban benar.
- Area soal memakai proteksi anti-copy dan klik kanan untuk mengurangi kecurangan.
- Review jawaban salah.
- IELTS Arena Reading/Writing dan SAT English Arena berbasis readiness.
- Live leaderboard memakai data peserta yang tersimpan di server saat mode publik.
- Admin panel preview disembunyikan default. Masuk lewat kartu Admin di layar login; password admin wajib diverifikasi server.
- Form admin memiliki kolom jawaban A, B, C, D dan pilihan kunci jawaban.

## Catatan pengembangan

Untuk publik, jangan hanya upload file statis dan jangan menaruh password di JavaScript. Jalankan `server.js` atau pindahkan API ke platform backend. Password peserta disimpan sebagai hash PBKDF2 + salt di server. Password admin sebaiknya disimpan sebagai `ADMIN_PASSWORD_HASH` + `ADMIN_PASSWORD_SALT` di environment hosting. Tahap produksi berikutnya adalah memindahkan storage JSON ke database seperti Supabase, Firebase, atau PostgreSQL, menambahkan rate limit, HTTPS, reset password, dan admin CRUD sungguhan.
