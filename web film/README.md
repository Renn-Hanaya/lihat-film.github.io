# 🎬 CINEVERSE — Next-Gen Cinema Streaming Web App

Platform streaming dan eksplorasi film modern bergaya Netflix dengan desain visual futuristik (**Cyber Cinema**), ditenagai oleh **The Movie Database (TMDB) API**, **Tailwind CSS**, dan **Alpine.js**.

---

## ✨ Karakteristik Desain (Calm, Modern & Minimalist)

1. **🌿 Desain Tenang & Minimalis (Tanpa Gradien)**:
   - Palet warna solid, *matte*, dan arsitektural: *Deep Graphite* (`#0c0d12`), *Muted Charcoal Surfaces* (`#15161d`), dan *Hairline Borders* (`#242631`).
   - **Bebas Gradien & Bebas Efek Neon**: Menghilangkan efek warna-warni berlebih untuk tampilan yang matang, elegan, dan profesional setara Apple TV+ atau MUBI.
   - Tombol aksi tegas dengan warna solid (Solid White `#ffffff` dan Solid Dark `#1f212b`).
   - Tipografi rapi dan bersih menggunakan *Plus Jakarta Sans*.

2. **🔥 Hero Showcase Dinamis**:
   - Banner cinematic menampilkan film trending terkini dengan backdrop ultra HD.
   - Auto-cycling slider & manual indicator controls.
   - Tombol langsung untuk **Tonton Trailer**, **Detail Info**, dan **+ Tambah ke Daftar**.

3. **🎞️ Netflix-Style Horizontal Rails (Kategori Film)**:
   - 🔥 *Sedang Tren Minggu Ini*
   - ⭐ *Film Paling Populer*
   - 🏆 *Mahakarya Rating Tertinggi*
   - 🎬 *Sedang Tayang di Bioskop*
   - 💥 *Aksi Menegangkan*
   - 🚀 *Fiksi Ilmiah & Fantasi*
   - Navigasi tombol panah kiri-kanan dengan *smooth scrolling*.

4. **🎥 Modal Detail & Pemutar Trailer Resmi**:
   - Embed YouTube otomatis mengambil trailer resmi dari TMDB (`/movie/{id}/videos`).
   - Sinopsis lengkap, genre pills, rating bintang, tahun rilis, dan durasi.
   - Daftar pemeran utama (*Top Cast*) dengan foto dan peran karakter.
   - Rekomendasi film serupa (*Similar Movies*).

5. **🔍 Pencarian Langsung (*Live Search*)**:
   - Pencarian instan berbasis *debouncing* (350ms).
   - Tampilan grid responsif untuk hasil pencarian.

6. **📑 Kategori Explorer**:
   - Filter film berdasarkan genre (Aksi, Petualangan, Animasi, Komedi, Sci-Fi, Horor, Romansa, Drama, dll.).

7. **📅 Katalog Berdasarkan Tahun Rilis (Dropdown Lengkap 1970 - 2026)**:
   - Filter dropdown lengkap mencakup seluruh tahun dari 2026 hingga 1970 tanpa terpotong.
   - Dilengkapi menu dropdown interaktif langsung di navbar serta tombol pintasan cepat untuk tahun populer.
   - Opsi pengurutan film (*Paling Populer* atau *Rating Tertinggi*).

8. **❤️ Daftar Tontonan Saya (*Watchlist*)**:
   - Simpan film favorit dengan penyimpanan lokal (*LocalStorage*).
   - Indikator counter pada navigasi bar.

---

## 📁 Struktur Folder

```text
web film/
├── index.html          # Halaman utama & template Alpine.js
├── css/
│   └── style.css       # Styling custom, ambient mesh, glassmorphism & animasi
├── js/
│   ├── config.js       # Konfigurasi TMDB API Key & image helper
│   ├── api.js          # Layanan fetch endpoint TMDB & error handling
│   └── app.js          # Alpine.js state store, modal, rails, & watchlist
└── README.md           # Dokumentasi aplikasi
```

---

## 🚀 Cara Menjalankan

Aplikasi ini dapat langsung dibuka di browser atau dijalankan menggunakan server lokal:

### Opsi 1: Menggunakan Python Server (Rekomendasi)
```bash
python -m http.server 3000
```
Buka browser dan akses: `http://localhost:3000`

### Opsi 2: Buka Langsung
Cukup klik ganda (double-click) pada file `index.html` di file explorer.

---

## 🔑 Konfigurasi API TMDB

API Key TMDB dikonfigurasi pada file `js/config.js`:
```javascript
const TMDB_CONFIG = {
  API_KEY: 'b445f844e085c657e0d92b909a380ba4',
  BASE_URL: 'https://api.themoviedb.org/3',
  ...
};
```
