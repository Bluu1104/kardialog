KardiaLog — Rekam Medis & Pendamping ACS

Aplikasi web pendamping mandiri bagi pasien Acute Coronary Syndrome (ACS) / Sindrom Koroner Akut untuk mengelola kepatuhan minum obat, memantau tanda vital harian, mempelajari materi klinis ACS, serta membangun pola hidup sehat jantung.

Dibangun dengan pendekatan Swiss clinical precision tanpa framework berat (zero build step) menggunakan HTML5 semantik, CSS modular dengan design tokens, dan JavaScript ES Modules murni.

Fitur Utama

1. Pengingat & Kepatuhan Obat (Medication Reminder)

Input jadwal resep obat mandiri (nama obat, dosis, jam minum, dan aturan pakai).

Pemeriksaan jadwal real-time tiap 15 detik dengan Web Notification API, banner alarm in-app, dan notifikasi audio (chime).

Mendukung pengingat beberapa obat pada jam yang sama secara bersamaan.

Toggle status Sudah Diminum / Belum serta tabel riwayat kepatuhan dengan filter status.

2. Pemantauan Kesehatan (Health Monitoring)

Pencatatan tekanan darah (sistolik/diastolik), denyut nadi, berat badan, keluhan, serta tanggal & waktu pemeriksaan.

Validasi fisiologis dan pratinjau klasifikasi klinis tekanan darah secara real-time.

Grafik tren SVG responsif untuk 10 pemeriksaan terakhir (sistolik, diastolik, dan denyut nadi).

Ekspor CSV (format UTF-8 BOM, terurut dari pemeriksaan terbaru) untuk dibawa saat kontrol dokter.

3. Edukasi ACS (ACS Education)

Tata letak monograf klinis 2 panel yang mencakup 6 bab terstruktur:

Pengertian ACS (STEMI, NSTEMI, Unstable Angina)

Penyebab & Faktor Risiko

Tanda & Gejala Tipikal maupun Atipikal

Komplikasi ACS

Pengobatan & Perawatan

Cara Mencegah Serangan Berulang

4. Pola Hidup Sehat Jantung (Heart Healthy Lifestyle)

Checklist kebiasaan protektif harian yang tersimpan otomatis per tanggal.

Panduan 5 pilar praktis (Diet Rendah Garam, Pola Makan Sehat, Berhenti Merokok, Aktivitas Fisik, Manajemen Stres & Istirahat).

Timer interaktif latihan Pernapasan Tenang 4–4–6.

Arsitektur & Struktur Proyek

kardialog/
├── index.html          # Shell aplikasi & markup semantik
├── .gitignore          # Konfigurasi file yang diabaikan Git
├── README.md           # Dokumentasi proyek
├── css/
│   ├── tokens.css      # Design tokens (warna, tipografi, radius, elevasi)
│   └── styles.css      # Tata letak responsif & komponen UI
└── js/
    ├── store.js        # Manajemen state (localStorage) & klasifikasi tekanan darah
    ├── content.js      # Konten edukasi ACS & panduan pola hidup sehat
    ├── charts.js       # Renderer grafik tren SVG murni
    └── app.js          # Controller utama, penjadwal notifikasi, & ekspor CSV


Teknologi:

HTML5 Semantik & Aksesibilitas (ARIA)

CSS3 Modular (Custom Properties, Grid, Flexbox)

Vanilla JavaScript (ES6+ Modules)

localStorage untuk penyimpanan persisten lokal di perangkat pengguna

Web Notification API & Web Audio API

Menjalankan Secara Lokal

Karena aplikasi menggunakan ES Modules (type="module"), jalankan melalui server lokal (jangan buka index.html langsung dengan protokol file://):

VS Code Live Server: Klik kanan index.html → Open with Live Server.

Node.js:

npx serve .


Python:

python -m http.server 8080


Deployment

Aplikasi ini bersifat static site tanpa proses build, sehingga dapat langsung di-host di Vercel, Netlify, atau GitHub Pages dengan mengarahkan Root Directory ke folder utama (./). Hosting melalui HTTPS disarankan agar Web Notification API bekerja optimal.

Penafian Medis (Medical Disclaimer)

KardiaLog dirancang sebagai alat bantu pencatatan mandiri dan edukasi pasien. Aplikasi ini tidak menggantikan diagnosis, saran, maupun penanganan dari dokter atau tenaga medis profesional. Apabila mengalami nyeri dada lebih dari 15 menit, menjalar ke lengan/rahang, disertai keringat dingin atau sesak napas berat, segera menuju IGD terdekat atau hubungi 119.
