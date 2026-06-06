const express = require("express");
const router  = express.Router();
const db      = require("../config/db");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

// Setup multer — simpan foto ke folder uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `order-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // maks 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error("Hanya file gambar yang diizinkan."));
  },
});

// Helper: ambil layanan dari DB
async function getLayanan(nama) {
  const [rows] = await db.execute(
    "SELECT * FROM layanan WHERE nama = ? AND aktif = 1 LIMIT 1",
    [nama]
  );
  return rows[0] || null;
}

// POST /api/orders — Tambah pesanan baru (support foto)
router.post("/", upload.single("foto"), async (req, res) => {
  const { namaPelanggan, nomorHP, layanan, qty, catatan } = req.body;
  const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!namaPelanggan || !nomorHP || !layanan || !qty) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }
  if (qty < 1) {
    return res.status(400).json({ message: "Jumlah item minimal 1." });
  }

  const layananData = await getLayanan(layanan);
  if (!layananData) {
    return res.status(400).json({ message: "Jenis layanan tidak valid atau tidak aktif." });
  }

  const totalHarga = layananData.harga * qty;
  const deadline   = new Date();
  deadline.setDate(deadline.getDate() + layananData.deadline_hari);
  const deadlineStr = deadline.toISOString().slice(0, 10);

  try {
    const [result] = await db.execute(
      `INSERT INTO orders
         (nama_pelanggan, nomor_hp, layanan, qty, catatan, total_harga, deadline, status, foto, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'menunggu', ?, NOW())`,
      [namaPelanggan, nomorHP, layanan, qty, catatan || "", totalHarga, deadlineStr, fotoPath]
    );
    return res.status(201).json({
      message: "Pesanan berhasil ditambahkan.",
      orderId: result.insertId,
      totalHarga,
      deadline: deadlineStr,
      foto: fotoPath,
    });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

// GET /api/orders — Semua pesanan
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC");
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Gagal mengambil data pesanan." });
  }
});

// GET /api/orders/cek/:id — Halaman publik pelanggan (data terbatas, tanpa nomor HP)
router.get("/cek/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, nama_pelanggan, layanan, qty, total_harga, deadline, status, foto, created_at
       FROM orders WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Nomor order tidak ditemukan." });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Gagal mengambil data." });
  }
});

// GET /api/orders/:id — Pesanan by ID (admin)
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Gagal mengambil data." });
  }
});

// PUT /api/orders/:id/status — Update status
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatus = ["menunggu", "diproses", "selesai", "diambil"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid." });
  }
  try {
    const [result] = await db.execute(
      "UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    return res.status(200).json({ message: "Status berhasil diperbarui." });
  } catch (err) {
    return res.status(500).json({ message: "Gagal memperbarui status." });
  }
});

// PUT /api/orders/:id — Update profil pelanggan
router.put("/:id", async (req, res) => {
  const { nama_pelanggan, nomor_hp, catatan } = req.body;
  try {
    const [result] = await db.execute(
      "UPDATE orders SET nama_pelanggan = ?, nomor_hp = ?, catatan = ? WHERE id = ?",
      [nama_pelanggan, nomor_hp, catatan, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    return res.status(200).json({ message: "Profil berhasil diperbarui." });
  } catch (err) {
    return res.status(500).json({ message: "Gagal mengupdate database." });
  }
});

// DELETE /api/orders/:id — Hapus pesanan
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM orders WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    return res.status(200).json({ message: "Pesanan berhasil dihapus." });
  } catch (err) {
    return res.status(500).json({ message: "Gagal menghapus pesanan." });
  }
});

module.exports = router;