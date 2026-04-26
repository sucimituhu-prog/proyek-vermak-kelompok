# Review Project — Studio Vermak

## Kesimpulan: Belum Final, Masih Ada yang Perlu Diperbaiki

Project Anda sudah **fungsional dan mencakup semua ketentuan tugas**, namun masih ada beberapa kekurangan teknis yang sebaiknya diperbaiki sebelum presentasi/submit. Berikut rinciannya:

---

## 🔴 KRITIS (Wajib Diperbaiki)

### 1. Title HTML Masih Default
**File:** `frontend/index.html`  
**Masalah:** `<title>frontend</title>` — seharusnya "Studio Vermak" atau "Manajemen Studio Vermak"

### 2. Backend Tidak Punya Script Start
**File:** `backend/package.json`  
**Masalah:** Tidak ada script `start` atau `dev`. Saat ini hanya ada `"test": "echo..."`.  
**Seharusnya:** Tambahkan `"start": "node server.js"` agar bisa dijalankan dengan `npm start`

### 3. Banyak Inline Styles Masih Tersisa
**File:** `AddOrder.jsx`, `CustomerList.jsx`, `FinanceReport.jsx`, `Dashboard.jsx`  
**Masalah:** Meskipun `index.css` sudah lengkap dengan class CSS, banyak komponen masih menggunakan `style={{...}}` inline. Ini bertentangan dengan praktik baik CSS dan membuat kode sulit dirawat.

**Contoh di AddOrder.jsx:**
```jsx
<div className="page" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
```
**Seharusnya:** Gunakan class CSS yang sudah didefinisikan di `index.css`

### 4. Tidak Ada File Skema Database (SQL)
**Masalah:** Tidak ada file `.sql` untuk membuat tabel `orders`. Orang lain yang ingin menjalankan project ini tidak tahu struktur tabel yang dibutuhkan.

**Seharusnya:** Buat file `backend/database/schema.sql` dengan perintah CREATE TABLE

### 5. README Masih Default Vite
**File:** `frontend/README.md`  
**Masalah:** Isinya masih template bawaan Vite, bukan penjelasan project Anda.

---

## 🟡 SEDANG (Sebaiknya Diperbaiki)

### 6. Tidak Ada Halaman 404
**File:** `App.jsx`  
**Masalah:** Jika user akses URL yang salah, tidak ada fallback page.  
**Seharusnya:** Tambahkan `<Route path="*" element={<NotFound />} />`

### 7. Tidak Ada Loading State Saat Fetch Data
**File:** `OrderContext.jsx`, `Dashboard.jsx`  
**Masalah:** Saat aplikasi pertama kali dibuka, jika koneksi lambat, tabel kosong tanpa indikator loading. User tidak tahu apakah data sedang di-load atau memang kosong.

### 8. Tidak Ada Error Handling Jika Backend Mati
**File:** `OrderContext.jsx`  
**Masalah:** Jika backend tidak berjalan, aplikasi hanya menampilkan console error. Tidak ada notifikasi ke user.

### 9. Chart di FinanceReport Hanya Placeholder
**File:** `FinanceReport.jsx`  
**Masalah:** Bagian grafik hanya berupa kotak dashed dengan teks "Bagian ini bisa menggunakan Chart.js". Ini terlihat tidak selesai.

---

## 🟢 RENDAH (Nice to Have)

### 10. TODO.md Langkah 7 Belum Diceklist
**File:** `TODO.md`  
**Masalah:** "Verify responsiveness and polish" masih belum selesai.

### 11. Tidak Ada Favicon yang Relevan
**File:** `frontend/public/favicon.svg`  
**Masalah:** Favicon masih default Vite.

### 12. Tombol Navigasi Tidak Punya Icon
**Masalah:** Navigasi hanya teks, tidak ada icon untuk memperjelas fungsi.

---

## 📊 Ringkasan Status

| Kategori | Jumlah | Status |
|---|---|---|
| Kritis | 5 | Perlu perbaikan segera |
| Sedang | 4 | Sebaiknya diperbaiki |
| Rendah | 3 | Optional |

**Rekomendasi:** Perbaiki minimal **5 poin kritis** di atas agar project terlihat lebih profesional dan siap presentasi.

---

## ✅ Checklist Sebelum Dinyatakan Final

- [ ] Title HTML diubah menjadi "Studio Vermak"
- [ ] Backend `package.json` punya script `start`
- [ ] Inline styles di `AddOrder.jsx` diganti class CSS
- [ ] Inline styles di `CustomerList.jsx` diganti class CSS
- [ ] Inline styles di `FinanceReport.jsx` diganti class CSS
- [ ] Inline styles di `Dashboard.jsx` dibersihkan
- [ ] Ada file `backend/database/schema.sql`
- [ ] `README.md` diupdate dengan penjelasan project
- [ ] Tambahkan loading state di `OrderContext.jsx`
- [ ] Tambahkan error handling UI saat backend mati
- [ ] Tambahkan route 404 di `App.jsx`
- [ ] Chart placeholder di `FinanceReport.jsx` dihapus atau diganti komponen nyata

