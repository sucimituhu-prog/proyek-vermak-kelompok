# Penjelasan: "Presentasi Menjelaskan Fungsi Aplikasi dan Kode Pembentuk Aplikasi"

Ketentuan ini artinya: **Dosen ingin melihat 2 hal dalam video presentasi Anda:**

1. **FUNGSI APLIKASI** — Bagaimana aplikasi ini bekerja? (Demo di Browser)
2. **KODE PEMBENTUK APLIKASI** — Bagaimana aplikasi ini dibuat? (Tunjukkan di VSCode)

---

## 📌 Analoginya Seperti Ini:

| Perumpamaan | Fungsi Aplikasi | Kode Pembentuk |
|---|---|---|
| **Mobil** | "Ini tombol gas, ini AC, ini bisa mundur" | "Mesin pakai 1500cc, transmisi otomatis, sistem rem ABS" |
| **Rumah** | "Ini ruang tamu, ini kamar, ini bisa buka pintu" | "Pondasi pakai beton, dinding bata ringan, atap galvalum" |
| **Aplikasi** | "Ini tombol Tambah Pesanan, ini bisa edit pelanggan, ini ada laporan" | "Ini pakai React, ini Context API, ini axios ke backend Express" |

---

## 🎬 Contoh Penjelasan dalam Video

### CONTOH 1 — Fitur "Tambah Pesanan"

#### A. Jelaskan FUNGSI APLIKASI (Demo di Browser):
```
"Nah, ini fitur Tambah Pesanan. Kita isi nama pelanggan, 
nomor HP, pilih layanan. Nanti total harga sama deadline 
langsung keluar otomatis. Kalau kita klik Simpan, 
datanya masuk ke database."
```
**Aksi:** Isi form di browser → tunjukkan harga otomatis → klik simpan.

#### B. Jelaskan KODE PEMBENTUK (Buka VSCode):
```
"Fitur ini dibuat pakai komponen AddOrder.jsx. Di sini 
pakai useState untuk nyimpen data form. Terus fungsi 
handleLayananChange itu cari harga dari array LAYANAN_OPTIONS, 
abis itu update state total_harga. Waktu submit, dia panggil 
addOrder dari OrderContext, terus kirim POST request ke 
backend pakai axios."
```
**Aksi:** Buka file `AddOrder.jsx` → scroll ke bagian `useState` → scroll ke `handleLayananChange` → scroll ke `handleSubmit`.

---

### CONTOH 2 — Fitur "Dashboard"

#### A. Jelaskan FUNGSI APLIKASI (Demo di Browser):
```
"Ini Dashboard, halaman utamanya. Ada 3 kotak yang nunjukin 
jumlah pesanan: yang baru masuk, yang lagi dikerjain, 
sama yang udah selesai. Di bawahnya ada tabel 5 pesanan 
terbaru. Kita bisa ganti status pesanan cukup klik tombol 
ini."
```
**Aksi:** Tunjukkan 3 card statistik → tunjukkan tabel → klik status pill → tunjukkan status berubah.

#### B. Jelaskan KODE PEMBENTUK (Buka VSCode):
```
"Dashboard ini dibuat di file Dashboard.jsx. Dia ambil data 
dari OrderContext pakai useOrders(). Terus data dipisah pakai 
filter() buat hitung yang statusnya menunggu, diproses, sama 
selesai. Status pill ini pakai class CSS status-pill, dan 
waktu diklik, dia panggil updateOrderStatus dari Context API."
```
**Aksi:** Buka `Dashboard.jsx` → tunjukkan `useOrders()` → tunjukkan `orders.filter()` → tunjukkan `updateOrderStatus()` di tombol.

---

### CONTOH 3 — Fitur "Data Pelanggan"

#### A. Jelaskan FUNGSI APLIKASI (Demo di Browser):
```
"Ini halaman Data Pelanggan. Tiap pelanggan tampilnya 
sebagai kartu gini. Ada nama, nomor HP, sama catatan 
catatan permaknya. Kalau mau edit, tinggal klik tombol 
Edit, nanti muncul popup modal."
```
**Aksi:** Tunjukkan kartu pelanggan → klik Edit → muncul modal → ubah data → simpan.

#### B. Jelaskan KODE PEMBENTUK (Buka VSCode):
```
"Halaman ini pakai CustomerList.jsx. Dia ambil data orders 
dari OrderContext. Buat modal edit, pakai useState buat 
atur isModalOpen sama editData. Waktu tombol Edit diklik, 
fungsi openEditModal isi state dengan data pelanggan yang 
dipilih. Waktu simpan, panggil updateOrder lewat Context. 
Delete juga sama, panggil deleteOrder."
```
**Aksi:** Buka `CustomerList.jsx` → tunjukkan `useState` untuk modal → tunjukkan `openEditModal` → tunjukkan `handleSaveEdit` → tunjukkan `deleteOrder`.

---

### CONTOH 4 — Fitur "Laporan Keuangan"

#### A. Jelaskan FUNGSI APLIKASI (Demo di Browser):
```
"Ini Laporan Keuangan. Ada 4 kartu ringkasan: total 
pendapatan, jumlah pesanan, rata-rata per order, sama 
jumlah yang udah selesai. Di bawahnya ada tabel rincian 
transaksi tiap pelanggan."
```
**Aksi:** Tunjukkan 4 summary card → scroll tabel transaksi.

#### B. Jelaskan KODE PEMBENTUK (Buka VSCode):
```
"Laporan ini ambil data dari OrderContext. Di OrderContext 
ada fungsi getTotalIncome yang pake reduce() buat ngitung 
total dari semua total_harga. Di backend, API-nya ada di 
orderRoutes.js yang query ke MySQL pakai mysql2. Koneksi 
database-nya diatur di db.js dengan connection pool."
```
**Aksi:** Buka `FinanceReport.jsx` → tunjukkan `getTotalIncome()` → buka `OrderContext.jsx` → tunjukkan `reduce()` → buka `orderRoutes.js` → tunjukkan endpoint GET → buka `db.js` → tunjukkan koneksi MySQL.

---

## ✅ Intinya:

| Yang Harus Dilakukan | Di Mana | Menjelaskan |
|---|---|---|
| **Demo fitur** | Browser ( Chrome ) | "Ini bisa ngapain aja" |
| **Jelaskan kode** | VSCode | "Ini dibuat gimana, pakai apa" |

**Jangan cuma demo browser doang** ❌  
**Jangan cuma baca kode doang** ❌  
**Harus keduanya** ✅ — Demo dulu, terus buka kodenya dan jelaskan.

---

## 📝 Format Sederhana per Orang:

```
"Sekarang saya jelaskan fitur [NAMA FITUR]."
→ [BUKA BROWSER, DEMO FITUR]
→ "Jadi fitur ini bisa [JELASKAN FUNGSI]."
→ [BUKA VSCODE, TUNJUKKAN FILE]
→ "Fitur ini dibuat di file [NAMA FILE]. Kita pakai [HOOK/TEKNOLOGI]."
→ [SCROLL KE BAGIAN KODE YANG RELEVAN]
→ "Di sini ada [JELASKAN BAGIAN KODE]."
→ "Terus di sini [JELASKAN BAGIAN KODE LAIN]."
```

---

## 🎯 Tips Agar Dosen Puas:

1. **Sebutkan teknologi spesifik**: "Ini pakai React Context API", "Ini pakai async await", "Ini pakai REST API"
2. **Tunjukkan file asli di VSCode**, bukan screenshot
3. **Scroll pelan** biar dosen bisa baca kode
4. **Jelaskan kenapa pakai teknologi itu**: "Kita pakai Context API biar nggak prop drilling"
5. **Sambungkan fitur dengan kode**: "Karena pakai axios di sini, data bisa langsung ke database"

