# Panduan Video Presentasi — Studio Vermak

**Durasi:** 10 – 15 Menit  
**Format:** Video Screen Recording + Voice Over  
**Platform:** YouTube (Public)  
**Ketentuan:** Setiap anggota WAJIB menjelaskan fungsi aplikasi + kode pembentuknya

---

## 🎬 Struktur Video (10–15 Menit)

### Intro Bersama (30–60 detik)
- Judul: "Aplikasi Manajemen Studio Vermak — Kelompok [Nomor]"
- Perkenalan 4 nama anggota
- Latar belakang: Studio Vermak adalah UMKM permak pakaian yang masih catat manual
- Tujuan: membangun aplikasi Web dengan React + Node.js untuk mengatasi masalah tersebut

---

## 📝 Script Presentasi per Anggota
**Setiap anggota menjelaskan 1 FITUR APLIKASI + KODE PEMBENTUKNYA**

---

### 👤 ANGGOTA 1 — Fitur: Dashboard + Kode: App.jsx & index.css (2.5–3 Menit)

**A. Jelaskan Fungsi Aplikasi (Demo di Browser):**
```
"Saya akan menjelaskan fitur Dashboard. Dashboard adalah halaman utama 
yang menampilkan ringkasan operasional Studio Vermak secara real-time. 
Di sini kita bisa melihat:
- Jumlah pesanan baru (status menunggu)
- Jumlah pesanan yang sedang diproses
- Jumlah pesanan yang sudah selesai
- 5 antrean pesanan terbaru

[Demo: tunjukkan card statistik & tabel]
Yang menarik, kita bisa mengubah status pesanan langsung dari sini. 
Misalnya pesanan Budi statusnya 'menunggu', saya klik pill status ini, 
maka langsung berubah menjadi 'selesai' dan tersimpan ke database."
```

**B. Jelaskan Kode Pembentuk (Tunjukkan di VSCode):**
```
"[Buka App.jsx]
Aplikasi ini dibangun dengan React. Di file App.jsx, kita menggunakan 
BrowserRouter dan Routes untuk navigasi antar 4 halaman: Dashboard, 
Tambah Pesanan, Data Pelanggan, dan Laporan. Semua komponen dibungkus 
dengan OrderProvider agar data bisa diakses secara global.

[Buka index.css]
Untuk desain, kami menggunakan CSS3 modern dengan CSS Variables 
seperti --primary-500, --slate-800, dan --shadow-lg. Kami juga 
menerapkan Responsive Web Design dengan media query @media 
(max-width: 900px) dan (max-width: 640px) agar tampilan tetap rapi 
di HP."
```

**Demo Wajib:**
- Tunjukkan Dashboard di browser
- Klik status pill untuk ubah status pesanan
- Buka `App.jsx` → jelaskan routing & OrderProvider
- Buka `index.css` → jelaskan CSS Variables & media query

---

### 👤 ANGGOTA 2 — Fitur: Tambah Pesanan + Kode: AddOrder.jsx (2.5–3 Menit)

**A. Jelaskan Fungsi Aplikasi (Demo di Browser):**
```
"Saya akan menjelaskan fitur Tambah Pesanan. Fitur ini digunakan 
untuk mencatat pesanan baru dari pelanggan. Form ini meminta 
nama pelanggan, nomor WhatsApp, jenis layanan, jumlah, dan catatan.

[Demo: pilih layanan 'Potong Celana']
Saat saya memilih jenis layanan, total harga dan estimasi deadline 
dihitung otomatis. Potong Celana harganya Rp 25.000 dengan deadline 
2 hari. Jika saya ubah jumlah menjadi 2, total harga langsung 
menjadi Rp 50.000.

[Demo: isi form lengkap & klik simpan]
Setelah disimpan, pesanan langsung masuk ke database MySQL dan 
muncul di halaman Dashboard."
```

**B. Jelaskan Kode Pembentuk (Tunjukkan di VSCode):**
```
"[Buka AddOrder.jsx]
File ini menggunakan React Hook useState untuk menyimpan data form. 
Fungsi handleLayananChange akan mencari harga dan deadline dari 
array LAYANAN_OPTIONS, lalu mengupdate state total_harga dan deadline.

Saat form disubmit, fungsi handleSubmit memanggil addOrder dari 
OrderContext. addOrder ini menggunakan async/await untuk mengirim 
POST request ke backend Express melalui axios. Ini adalah contoh 
JavaScript Lanjutan ES6+ yang kami terapkan."
```

**Demo Wajib:**
- Isi form Tambah Pesanan lengkap
- Tunjukkan perhitungan otomatis harga & deadline
- Simpan pesanan → cek Dashboard (pesanan baru muncul)
- Buka `AddOrder.jsx` → jelaskan useState & handleLayananChange

---

### 👤 ANGGOTA 3 — Fitur: Data Pelanggan + Kode: CustomerList.jsx & OrderContext.jsx (2.5–3 Menit)

**A. Jelaskan Fungsi Aplikasi (Demo di Browser):**
```
"Saya akan menjelaskan fitur Data Pelanggan. Di halaman ini, 
semua data pelanggan ditampilkan dalam bentuk kartu yang rapi. 
Setiap kartu menampilkan nama, nomor WhatsApp, dan catatan khusus.

[Demo: klik tombol Edit pada salah satu kartu]
Kita bisa mengedit profil pelanggan melalui modal ini. Saya bisa 
mengubah nama, nomor HP, maupun catatan khusus. Catatan ini 
bisa berisi instruksi permak yang detail, misalnya 'jahitan double, 
pinggang kecil 2cm'.

[Demo: simpan perubahan]
Data langsung terupdate di database. Kita juga bisa menghapus 
pelanggan jika diperlukan."
```

**B. Jelaskan Kode Pembentuk (Tunjukkan di VSCode):**
```
"[Buka OrderContext.jsx]
Aplikasi ini menggunakan State Management dengan React Context API. 
OrderContext menyediakan state global 'orders' dan fungsi-fungsi 
seperti fetchOrders, addOrder, updateOrder, dan deleteOrder. 
Dengan Context API, semua komponen bisa mengakses data tanpa 
prop drilling.

[Buka CustomerList.jsx]
Di file ini, kami menggunakan useState untuk mengatur modal edit 
dan data form. Fungsi openEditModal akan mengisi state editData 
dengan data pelanggan yang dipilih. Saat tombol Simpan ditekan, 
handleSaveEdit memanggil updateOrder dari Context yang akan 
mengirim PUT request ke backend."
```

**Demo Wajib:**
- Tunjukkan halaman Data Pelanggan
- Klik Edit → ubah data di modal → simpan
- Buka `OrderContext.jsx` → jelaskan Context API & fungsi CRUD
- Buka `CustomerList.jsx` → jelaskan modal & useState

---

### 👤 ANGGOTA 4 — Fitur: Laporan Keuangan + Kode: orderRoutes.js & db.js (2.5–3 Menit)

**A. Jelaskan Fungsi Aplikasi (Demo di Browser):**
```
"Saya akan menjelaskan fitur Laporan Keuangan. Halaman ini 
menampilkan ringkasan finansial Studio Vermak secara real-time:
- Total pendapatan dari semua pesanan
- Jumlah total pesanan yang masuk
- Rata-rata pendapatan per order
- Jumlah pesanan yang sudah selesai

[Demo: tunjukkan 4 kartu statistik]
Di bawahnya ada tabel rincian transaksi terbaru yang menampilkan 
ID, nama pelanggan, layanan, dan total harga per pesanan. Semua 
angka ini dihitung langsung dari database, bukan data statis."
```

**B. Jelaskan Kode Pembentuk (Tunjukkan di VSCode):**
```
"[Buka orderRoutes.js]
Backend kami dibangun dengan Node.js dan Express.js. File ini 
berisi REST API endpoints:
- POST / untuk menambah pesanan
- GET / untuk mengambil semua pesanan
- PUT /:id/status untuk update status
- PUT /:id untuk update profil pelanggan
- DELETE /:id untuk menghapus pesanan

Yang penting, harga total dihitung ulang di backend menggunakan 
objek LAYANAN. Ini mencegah manipulasi harga dari frontend. 
Kami juga melakukan validasi status yang hanya boleh: menunggu, 
diproses, selesai, atau diambil.

[Buka db.js]
Koneksi ke database MySQL menggunakan mysql2 dengan connection pool. 
Database bernama 'vermak_db' dengan tabel 'orders'.

[Buka browser → localhost:5000/api/orders]
Ini adalah response JSON dari API yang menunjukkan data langsung 
dari database."
```

**Demo Wajib:**
- Tunjukkan halaman Laporan Keuangan
- Buka `orderRoutes.js` → jelaskan 5 endpoint & validasi
- Buka `db.js` → jelaskan koneksi MySQL
- Buka `localhost:5000/api/orders` di browser → tunjukkan JSON

---

### Outro Bersama (30–60 detik)

```
"Demikian presentasi aplikasi Manajemen Studio Vermak dari kelompok kami. 
Setiap anggota telah menjelaskan fitur aplikasi beserta kode pembentuknya.
Aplikasi ini dibangun dengan React, Context API, Node.js, Express, 
dan MySQL. Semua ketentuan tugas telah kami implementasikan.

Terima kasih. Wassalamu'alaikum."
```

---

## 🛠️ Cara Merekam Video

### Tools Rekomendasi (Gratis):
| Tool | Platform | Cara Pakai |
|---|---|---|
| **OBS Studio** | Windows/Mac/Linux | Rekam layar + webcam + mic |
| **ShareX** | Windows | Rekam layar, ringan |
| **Screen Recorder (Windows)** | Windows 10/11 | Tekan Win+Alt+R (Xbox Game Bar) |
| **Loom** | Browser | Rekam langsung dari browser, mudah upload |

### Tips Rekaman:
1. **Resolusi:** 1920x1080 (Full HD)
2. **Audio:** Gunakan earphone/mic untuk suara jelas
3. **Layout:** Browser (kiri) + VSCode (kanan) atau fullscreen browser saat demo
4. **Cursor:** Gerakkan mouse pelan dan jelas saat menunjuk
5. **Jeda:** Beri jeda 1-2 detik antar bagian untuk editing

---

## 📤 Cara Upload ke YouTube

1. Buka [youtube.com](https://youtube.com) → Login akun Google
2. Klik icon **Create** (➕) → **Upload video**
3. Pilih file video yang sudah direkam
4. **Title:** `Presentasi Aplikasi Studio Vermak - Kelompok [X]`
5. **Description:**
   ```
   Aplikasi Manajemen Studio Vermak
   Kelompok: [Nomor Kelompok]
   Anggota:
   1. [Nama 1] - [NIM]
   2. [Nama 2] - [NIM]
   3. [Nama 3] - [NIM]
   4. [Nama 4] - [NIM]

   Teknologi: React, Context API, Node.js, Express.js, MySQL
   Mata Kuliah: [Nama MK]
   Dosen: [Nama Dosen]
   ```
6. **Visibility:** Pilih **Public** (bukan Private/Unlisted)
7. Klik **Publish**
8. **Copy link video** (format: `https://youtu.be/XXXXXXX`)

---

## 📝 Submit ke OnClass

1. Login ke [onclass.ump.ac.id](https://onclass.ump.ac.id)
2. Cari tugas yang sesuai
3. Paste link YouTube di kolom yang tersedia
4. Submit sebelum deadline

---

## ✅ Checklist Sebelum Rekam

- [ ] Semua anggota sudah latihan sesuai script
- [ ] Backend (`node backend/server.js`) dan Frontend (`npm run dev`) sudah berjalan
- [ ] Database MySQL aktif dengan data dummy (minimal 3 pesanan)
- [ ] Browser siap (buka tab: Dashboard, Add Order, Customers, Reports)
- [ ] VSCode siap (buka file sesuai pembagian masing-masing anggota)
- [ ] Mic dan screen recorder sudah di-test
- [ ] Ruangan tenang (bebas noise)

