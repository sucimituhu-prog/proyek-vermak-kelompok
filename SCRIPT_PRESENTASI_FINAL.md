# Script Video Presentasi Final — Studio Vermak
**Aturan:** Setiap anggota menjelaskan FUNGSI APLIKASI (demo browser) + KODE PEMBENTUK (VSCode) sesuai teknologi yang dibagi.

---

## Intro Bersama (1 menit)
*Semua anggota muncul di video (bisa bergantian screen recording dengan audio).*

"Assalamu'alaikum warahmatullahi wabarakatuh. Kami dari Kelompok [Nomor], yang beranggotakan:
1. [Nama 1]
2. [Nama 2]
3. [Nama 3]
4. [Nama 4]

Kami akan mempresentasikan aplikasi Web **Manajemen Studio Vermak**. Aplikasi ini dibangun untuk UMKM jasa permak pakaian agar pencatatan pesanan, perhitungan harga, tracking status, dan laporan keuangan menjadi lebih terdigitalisasi.

Aplikasi kami menggunakan 5 teknologi utama:
1. HTML5, CSS3, dan Responsive Web Design
2. JavaScript Lanjutan (ES6+, Asynchronous, Modules)
3. Frontend Framework React
4. State Management Context API
5. Backend Node.js dan Express.js

Berikut pembagian presentasi dari kami."

---

## 👤 ANGGOTA 1 — HTML5, CSS3, Responsive Web Design + Fitur Dashboard
**Durasi:** 3 menit

### A. Jelaskan Fungsi Aplikasi (Browser)
"[Buka browser di halaman Dashboard]

Saya akan memperkenalkan halaman Dashboard. Di sini kita bisa melihat ringkasan operasional Studio Vermak secara real-time. Ada tiga kotak statistik: Pesanan Baru, Sedang Diproses, dan Selesai. Di bawahnya ada tabel lima antrean terbaru. Kita juga bisa mengubah status pesanan langsung dengan mengklik tombol statusnya.

[Demo: klik status pill, tunjukkan berubah dari menunggu ke selesai]

Selain itu, aplikasi ini responsive. Jika saya perkecil ukuran browser seperti layar HP...

[Demo: Ctrl+Shift+M, pilih iPhone SE]
...tampilannya tetap rapi. Navigasi berubah jadi grid dua kolom, tabel bisa di-scroll horizontal, dan kartu menyesuaikan lebar layar."

### B. Jelaskan Kode Pembentuk (VSCode)
"[Buka VSCode, file `frontend/src/index.css]

Teknologi yang saya bawakan adalah **HTML5, CSS3, dan Responsive Web Design**.

Di file index.css, kami menerapkan CSS3 modern dengan **CSS Variables** seperti `--primary-500`, `--slate-800`, dan `--shadow-lg`. Ini membuat warna dan spacing konsisten di seluruh aplikasi.

[Scroll ke bagian App Shell & Page Layout]

Kami menggunakan **Flexbox** untuk header dan navigasi, serta **CSS Grid** untuk layout card dan panel. Contohnya, class `.card-grid` menggunakan `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` agar kartu menyesuaikan lebar otomatis.

[Scroll ke bagian Responsive]

Untuk **Responsive Web Design**, kami menggunakan media query. Contohnya `@media (max-width: 900px)` akan mengubah layout dari dua kolom jadi satu kolom, dan `@media (max-width: 640px)` akan mengubah navigasi jadi grid dua kolom agar tombol tidak terlalu kecil di layar HP.

[Scroll ke bagian Animations]

Kami juga menambahkan animasi dengan `@keyframes` seperti fadeSlideUp dan modalPop agar transisi antar halaman terasa halus."

---

## 👤 ANGGOTA 2 — JavaScript Lanjutan (ES6+, Asynchronous, Modules) + Fitur Tambah Pesanan
**Durasi:** 3 menit

### A. Jelaskan Fungsi Aplikasi (Browser)
"[Buka browser di halaman Tambah Pesanan]

Saya akan menjelaskan fitur Tambah Pesanan. Di sini kita mengisi nama pelanggan, nomor WhatsApp, memilih jenis layanan, dan jumlah item.

[Demo: pilih 'Potong Celana' dari dropdown]

Begitu layanan dipilih, total harga dan estimasi deadline muncul otomatis. Potong Celana harganya Rp 25.000 dengan deadline 2 hari. Jika saya ubah jumlah jadi 2, totalnya langsung jadi Rp 50.000.

[Demo: isi semua field, klik Simpan]

Setelah klik Simpan, muncul notifikasi sukses dan pesanan langsung masuk ke database. Kita bisa cek di Dashboard, pesanan baru sudah muncul."

### B. Jelaskan Kode Pembentuk (VSCode)
"[Buka VSCode, file `frontend/src/pages/AddOrder.jsx`]

Teknologi yang saya bawakan adalah **JavaScript Lanjutan (ES6+, Asynchronous, Modules)**.

[Scroll ke bagian import]

Pertama, kami menggunakan **ES Modules** dengan sintaks `import` dan `export`. Contohnya di sini kita import `useState` dari React dan `useOrders` dari context.

[Scroll ke bagian LAYANAN_OPTIONS]

Ini adalah array of objects menggunakan sintaks ES6. Setiap layanan disimpan sebagai object dengan shorthand property.

[Scroll ke bagian handleLayananChange]

Fungsi ini menggunakan **arrow function** dan **destructuring** dari event target. Kami juga menggunakan **template literal** saat menampilkan harga di option dropdown.

[Scroll ke bagian handleSubmit]

Di sini kami menggunakan **Asynchronous JavaScript** dengan `async/await`. Fungsi `handleSubmit` menunggu `addOrder(formData)` selesai sebelum menampilkan notifikasi sukses. Jika terjadi error, akan masuk ke block catch.

[Scroll ke bagian state]

Kami menggunakan **spread operator** ES6 saat update state: `setFormData({...formData, layanan: namaLayanan})`. Ini memastikan hanya field yang berubah yang di-update, sisanya tetap."

---

## 👤 ANGGOTA 3 — Frontend Framework (React) + State Management (Context API) + Fitur Data Pelanggan
**Durasi:** 3 menit

### A. Jelaskan Fungsi Aplikasi (Browser)
"[Buka browser di halaman Data Pelanggan]

Saya akan menjelaskan fitur Data Pelanggan. Semua pelanggan ditampilkan dalam bentuk kartu. Setiap kartu menunjukkan nama, nomor WhatsApp, dan catatan khusus dari permakannya.

[Demo: klik tombol Edit pada salah satu kartu]

Akan muncul modal popup untuk mengedit data pelanggan. Saya bisa mengubah nama, nomor HP, maupun catatan permakan. Misalnya saya tambahkan catatan: 'Pinggang dikecilin 3cm, jahitan double'.

[Demo: simpan, tunjukkan data berubah]

Data langsung terupdate di seluruh aplikasi. Jika kita cek Dashboard, nama yang diubah juga ikut berubah. Ini karena kami menggunakan state management global."

### B. Jelaskan Kode Pembentuk (VSCode)
"[Buka VSCode, file `frontend/src/App.jsx`]

Teknologi pertama yang saya bawakan adalah **Frontend Framework React**. Aplikasi ini dibangun dengan React 19.

[Scroll ke bagian Router]

Kami menggunakan **React Router DOM** untuk navigasi antar halaman. Di sini ada 4 route: `/` untuk Dashboard, `/add-order` untuk Tambah Pesanan, `/customers` untuk Data Pelanggan, dan `/reports` untuk Laporan.

[Scroll ke bagian OrderProvider]

Seluruh aplikasi dibungkus dengan `OrderProvider`. Ini adalah implementasi **State Management dengan Context API**.

[Buka file `frontend/src/context/OrderContext.jsx`]

Context API memungkinkan kita menyimpan state global yang bisa diakses semua komponen tanpa prop drilling. Di file ini, kami buat `OrderContext` yang menyimpan:
- `orders` — array data pesanan
- `fetchOrders` — fungsi ambil data dari backend
- `addOrder` — fungsi tambah pesanan
- `updateOrder` — fungsi update data pelanggan
- `deleteOrder` — fungsi hapus pesanan

[Scroll ke bagian fetchOrders]

`fetchOrders` menggunakan `async/await` dan `axios` untuk GET data dari `http://localhost:5000/api/orders`. Hasilnya disimpan ke state `orders` dengan `setOrders`.

[Scroll ke bagian useOrders]

Komponen lain bisa mengakses data ini dengan custom hook `useOrders()` yang memanggil `useContext(OrderContext)`.

[Buka file `frontend/src/pages/CustomerList.jsx`]

Di Data Pelanggan, kami menggunakan **React Hooks** `useState` untuk mengatur modal edit. State `isModalOpen` mengontrol tampilan modal, dan `editData` menyimpan form sementara. Saat tombol Edit diklik, `openEditModal` mengisi `editData` dengan data pelanggan yang dipilih."

---

## 👤 ANGGOTA 4 — Backend Development (Node.js & Express.js) + Fitur Laporan Keuangan
**Durasi:** 3 menit

### A. Jelaskan Fungsi Aplikasi (Browser)
"[Buka browser di halaman Laporan Keuangan]

Saya akan menjelaskan fitur Laporan Keuangan. Halaman ini menampilkan ringkasan finansial Studio Vermak secara real-time dari database.

Ada empat kartu ringkasan:
- Total Pendapatan: jumlah semua total harga pesanan
- Jumlah Pesanan: total order yang masuk
- Rata-rata per Order: pembagian total pendapatan dengan jumlah pesanan
- Pesanan Selesai: yang statusnya sudah selesai

Di bawahnya ada tabel rincian transaksi terbaru yang menampilkan ID, nama pelanggan, layanan, dan total harga per pesanan. Semua angka ini langsung dari database MySQL, bukan data statis."

### B. Jelaskan Kode Pembentuk (VSCode)
"[Buka VSCode, file `backend/server.js`]

Teknologi yang saya bawakan adalah **Backend Development dengan Node.js dan Express.js**.

[Scroll ke bagian import & app]

Di sini kita import Express dan CORS. `app.use(cors())` memungkinkan frontend dan backend berkomunikasi meski berjalan di port berbeda. `app.use(express.json())` untuk parsing body request dalam format JSON.

[Scroll ke bagian route & listen]

Kami daftarkan router `orderRoutes` di path `/api/orders`. Server berjalan di port 5000.

[Buka file `backend/routes/orderRoutes.js`]

Ini adalah REST API kami. Ada beberapa endpoint:
- `POST /` — tambah pesanan baru dengan validasi input
- `GET /` — ambil semua pesanan dari MySQL
- `PUT /:id/status` — update status pesanan dengan validasi enum
- `PUT /:id` — update profil pelanggan
- `DELETE /:id` — hapus pesanan

[Penting: scroll ke bagian POST]

Yang penting, **harga total dihitung ulang di backend**, bukan diterima langsung dari frontend. Ini mencegah manipulasi harga. Kami juga melakukan validasi status yang hanya boleh: menunggu, diproses, selesai, atau diambil.

[Buka file `backend/config/db.js`]

Koneksi database menggunakan **mysql2** dengan connection pool. Database-nya bernama `vermak_db` yang berjalan di localhost port 3306.

[Buka browser, tab baru, ketik `localhost:5000/api/orders`]

Ini adalah response JSON dari API. Data ini yang di-consume oleh frontend melalui axios, lalu ditampilkan di halaman Laporan maupun halaman lainnya."

---

## Outro Bersama (1 menit)
*Semua anggota menyebutkan teknologi yang telah dipresentasikan.*

"Jadi kesimpulannya, aplikasi Manajemen Studio Vermak kami menggunakan:
1. HTML5, CSS3, dan Responsive Web Design — untuk tampilan modern dan responsif
2. JavaScript Lanjutan ES6+, Asynchronous, Modules — untuk logika frontend yang efisien
3. React — sebagai frontend framework
4. Context API — untuk state management global
5. Node.js dan Express.js — untuk backend REST API

Semua ketentuan tugas telah kami implementasikan. Terima kasih atas perhatiannya. Wassalamu'alaikum warahmatullahi wabarakatuh."

---

## 📋 Checklist per Anggota Sebelum Rekam

| Anggota | File yang Harus Terbuka di VSCode | Halaman yang Harus Terbuka di Browser |
|---|---|---|
| 1 | `index.css`, `App.jsx` | Dashboard |
| 2 | `AddOrder.jsx` | Tambah Pesanan, Dashboard |
| 3 | `App.jsx`, `OrderContext.jsx`, `CustomerList.jsx` | Data Pelanggan, Dashboard |
| 4 | `server.js`, `orderRoutes.js`, `db.js` | Laporan, `localhost:5000/api/orders` |
