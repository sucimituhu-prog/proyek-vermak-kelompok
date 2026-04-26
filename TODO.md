# TODO - Fix database pelanggan kosong di web

- [x] Analisis masalah: backend tidak punya tabel & API customers; frontend hanya pakai localStorage.
- [x] Buat migration SQL tabel `customers`.
- [x] Buat `backend/routes/customerRoutes.js` (CRUD API customers).
- [x] Update `backend/server.js` untuk mount route `/api/customers`.
- [x] Update `frontend/src/pages/CustomerList.jsx` agar fetch data dari backend via API.
- [ ] Jalankan migrasi SQL di MySQL & restart backend.


