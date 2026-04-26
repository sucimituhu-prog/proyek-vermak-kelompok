# Panduan Presentasi Kelompok — Aplikasi Studio Vermak

**Jumlah Anggota:** 4 Orang  
**Durasi Presentasi:** 10–15 Menit  
**Struktur:** Demo Aplikasi + Penjelasan Teknis per Rubrik

---

## Pembagian Peran & Materi Presentasi

### 👤 ANGGOTA 1 — Pembuka & Konsep Bisnis
**Waktu:** ~3 Menit

| No | Materi yang Dijelaskan | Penjelasan |
|---|---|---|
| 1 | **Latar Belakang** | Kenapa aplikasi ini dibuat? (Studio Vermak masih catat manual → sering salah hitung & ketinggalan deadline) |
| 2 | **Profil Instansi** | Studio Vermak adalah UMKM jasa permak pakaian (Potong Celana, Ganti Resleting, Kecilin Baju, Permak Jas) |
| 3 | **Manfaat Aplikasi** | Mempermudah: pencatatan pesanan, perhitungan otomatis, tracking status, laporan keuangan harian |
| 4 | **Fitur Utama (Overview)** | Sebutkan 4 halaman: Dashboard, Tambah Pesanan, Data Pelanggan, Laporan |

**Demo:** Buka aplikasi, tunjukkan halaman Dashboard secara singkat.

---

### 👤 ANGGOTA 2 — Frontend & Desain (React + UI/UX)
**Waktu:** ~3–4 Menit

| No | Materi yang Dijelaskan | Bukti di Kode |
|---|---|---|
| 1 | **HTML5 & CSS3** | `index.css` pakai CSS Variables, Flexbox, Grid, animasi `@keyframes`, glassmorphism |
| 2 | **Responsive Web Design** | Tunjukkan media query `@media (max-width: 900px)` dan `@media (max-width: 640px)` → coba resize browser |
| 3 | **React sebagai Framework** | `App.jsx` pakai React Router, functional components, hooks (`useState`, `useEffect`) |
| 4 | **JavaScript Lanjutan (ES6+)** | Arrow functions, destructuring, `async/await`, ES Modules (`import/export`) |

**Demo:** 
- Resize browser ke ukuran HP (Ctrl+Shift+M di Chrome) → tunjukkan layout responsif.
- Buka `frontend/src/App.jsx` → jelaskan routing & struktur komponen.

---

### 👤 ANGGOTA 3 — State Management & Fitur Bisnis
**Waktu:** ~3–4 Menit

| No | Materi yang Dijelaskan | Bukti di Kode |
|---|---|---|
| 1 | **State Management (Context API)** | `OrderContext.jsx` → global state untuk `orders`, `addOrder`, `updateOrderStatus`, `deleteOrder` |
| 2 | **Fitur Tambah Pesanan** | `AddOrder.jsx` → form validasi, perhitungan harga & deadline otomatis berdasarkan jenis layanan |
| 3 | **Fitur Data Pelanggan** | `CustomerList.jsx` → kartu pelanggan, modal edit profil, catatan khusus, hapus data |
| 4 | **Fitur Dashboard** | `Dashboard.jsx` → ringkasan statistik real-time, toggle status pesanan (klik status berubah) |

**Demo:**
- Tambah 1 pesanan baru → tunjukkan harga & deadline otomatis.
- Ubah status pesanan di Dashboard (klik pill status).
- Edit data pelanggan di modal.

---

### 👤 ANGGOTA 4 — Backend & Database
**Waktu:** ~3–4 Menit

| No | Materi yang Dijelaskan | Bukti di Kode |
|---|---|---|
| 1 | **Backend Node.js & Express.js** | `backend/server.js` → server berjalan di port 5000, middleware CORS & JSON |
| 2 | **REST API Endpoints** | `orderRoutes.js` → POST, GET, PUT (status & profil), DELETE |
| 3 | **Database MySQL** | `backend/config/db.js` → koneksi pool ke `vermak_db`, tabel `orders` |
| 4 | **Validasi & Keamanan** | Harga dihitung ulang di backend (jangan percaya frontend), validasi status enum |
| 5 | **Laporan Keuangan** | `FinanceReport.jsx` → total pendapatan, rata-rata per order, jumlah pesanan selesai |

**Demo:**
- Buka Postman / browser → `http://localhost:5000/api/orders` → tunjukkan data JSON.
- Buka halaman Laporan → tunjukkan perhitungan otomatis dari database.
- Hapus 1 pesanan → refresh halaman → data hilang (sinkron dengan DB).

---

## Alur Demo Presentasi (Urutan Layar)

```
1. Dashboard        → Anggota 1 (Pembuka)
2. Tambah Pesanan   → Anggota 3 (isi form → simpan)
3. Dashboard        → Anggota 3 (lihat pesanan baru masuk)
4. Data Pelanggan   → Anggota 3 (edit modal → simpan)
5. Laporan          → Anggota 4 (lihat angka berubah)
6. Responsive View  → Anggota 2 (resize browser)
7. Backend/API      → Anggota 4 (tunjukkan di Postman/browser)
```

---

## Tips Presentasi

| Tips | Keterangan |
|---|---|
| **Jalankan dulu** | Pastikan `backend/server.js` dan `frontend (npm run dev)` sudah nyala sebelum presentasi |
| **Siapkan data dummy** | Isi 3–5 pesanan sebelum demo agar tidak kosong |
| **Tunjukkan kode** | Buka VSCode side-by-side dengan browser untuk membuktikan teknologi yang dipakai |
| **Fokus pada "masalah → solusi"** | Jangan hanya demo fitur, jelaskan kenapa fitur itu penting untuk Studio Vermak |

---

## Checklist Sebelum Presentasi

- [ ] Backend berjalan (`node backend/server.js`)
- [ ] Frontend berjalan (`npm run dev` di folder frontend)
- [ ] MySQL aktif & database `vermak_db` tersedia
- [ ] Minimal 3 data pesanan sudah diisi
- [ ] Browser siap (buka tab Dashboard, Add Order, Customers, Reports)
- [ ] VSCode siap (buka file: `App.jsx`, `OrderContext.jsx`, `orderRoutes.js`, `index.css`)

