const express = require("express");
const router  = express.Router();
const db      = require("../config/db"); 


const LAYANAN = {
  "Potong Celana":   { harga: 25000, deadlineHari: 2 },
  "Ganti Resleting": { harga: 20000, deadlineHari: 1 },
  "Permak Jas":      { harga: 75000, deadlineHari: 5 },
};


function hitungDeadline(namaLayanan) {
  const layanan = LAYANAN[namaLayanan];
  if (!layanan) return null;
  const now = new Date();
  now.setDate(now.getDate() + layanan.deadlineHari);
  return now.toISOString().slice(0, 10);
}


router.post("/", async (req, res) => {
  const { namaPelanggan, nomorHP, layanan, qty, catatan } = req.body;

  // Validasi
  if (!namaPelanggan || !nomorHP || !layanan || !qty) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }
  if (!LAYANAN[layanan]) {
    return res.status(400).json({ message: "Jenis layanan tidak valid." });
  }
  if (qty < 1) {
    return res.status(400).json({ message: "Jumlah item minimal 1." });
  }

  // Hitung ulang di backend (jangan percaya data dari frontend)
  const totalHarga = LAYANAN[layanan].harga * qty;
  const deadline   = hitungDeadline(layanan);

  try {
    const [result] = await db.execute(
      `INSERT INTO orders
         (nama_pelanggan, nomor_hp, layanan, qty, catatan, total_harga, deadline, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'menunggu', NOW())`,
      [namaPelanggan, nomorHP, layanan, qty, catatan || "", totalHarga, deadline]
    );

    return res.status(201).json({
      message: "Pesanan berhasil ditambahkan.",
      orderId: result.insertId,
      totalHarga,
      deadline,
    });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

// ─── GET /api/orders — Semua pesanan ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return res.status(500).json({ message: "Gagal mengambil data pesanan." });
  }
});

// ─── GET /api/orders/:id — Pesanan by ID ─────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM orders WHERE id = ?", [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GET /api/orders/:id error:", err);
    return res.status(500).json({ message: "Gagal mengambil data." });
  }
});

// ─── PUT /api/orders/:id/status — Update status ──────────────────────────────
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatus = ["menunggu", "diproses", "selesai", "diambil"];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Status tidak valid." });
  }

  try {
    const [result] = await db.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
    return res.status(200).json({ message: "Status berhasil diperbarui." });
  } catch (err) {
    console.error("PUT /api/orders/:id/status error:", err);
    return res.status(500).json({ message: "Gagal memperbarui status." });
  }
});

// ─── DELETE /api/orders/:id — Hapus pesanan ──────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM orders WHERE id = ?", [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
    return res.status(200).json({ message: "Pesanan berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/orders/:id error:", err);
    return res.status(500).json({ message: "Gagal menghapus pesanan." });
  }
});
// ─── PUT /api/orders/:id — Update Profil Pelanggan (BARU) ──────────────────
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  // Kita ambil nama_pelanggan dan nomor_hp dari request body
  const { nama_pelanggan, nomor_hp } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE orders SET nama_pelanggan = ?, nomor_hp = ? WHERE id = ?",
      [nama_pelanggan, nomor_hp, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pesanan/Pelanggan tidak ditemukan." });
    }

    return res.status(200).json({ message: "Profil pelanggan berhasil diperbarui." });
  } catch (err) {
    console.error("PUT /api/orders/:id error:", err);
    return res.status(500).json({ message: "Gagal mengupdate database." });
  }
});

module.exports = router;