const express = require("express");
const router  = express.Router();
const db      = require("../config/db");

// GET /api/layanan — Semua layanan
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM layanan WHERE aktif = 1 ORDER BY nama ASC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET /api/layanan error:", err);
    return res.status(500).json({ message: "Gagal mengambil data layanan." });
  }
});

// GET /api/layanan/all — Semua layanan termasuk nonaktif (untuk halaman admin)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM layanan ORDER BY nama ASC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET /api/layanan/all error:", err);
    return res.status(500).json({ message: "Gagal mengambil data layanan." });
  }
});

// POST /api/layanan — Tambah layanan baru
router.post("/", async (req, res) => {
  const { nama, harga, deadline_hari, deskripsi } = req.body;

  if (!nama || !harga || !deadline_hari) {
    return res.status(400).json({ message: "Nama, harga, dan deadline wajib diisi." });
  }
  if (harga < 0 || deadline_hari < 1) {
    return res.status(400).json({ message: "Harga dan deadline tidak valid." });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO layanan (nama, harga, deadline_hari, deskripsi, aktif)
       VALUES (?, ?, ?, ?, 1)`,
      [nama, harga, deadline_hari, deskripsi || ""]
    );
    return res.status(201).json({
      message: "Layanan berhasil ditambahkan.",
      id: result.insertId,
    });
  } catch (err) {
    console.error("POST /api/layanan error:", err);
    return res.status(500).json({ message: "Gagal menyimpan layanan." });
  }
});

// PUT /api/layanan/:id — Update layanan
router.put("/:id", async (req, res) => {
  const { nama, harga, deadline_hari, deskripsi, aktif } = req.body;

  if (!nama || !harga || !deadline_hari) {
    return res.status(400).json({ message: "Nama, harga, dan deadline wajib diisi." });
  }

  try {
    const [result] = await db.execute(
      `UPDATE layanan SET nama = ?, harga = ?, deadline_hari = ?, deskripsi = ?, aktif = ?
       WHERE id = ?`,
      [nama, harga, deadline_hari, deskripsi || "", aktif ?? 1, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Layanan tidak ditemukan." });
    }
    return res.status(200).json({ message: "Layanan berhasil diperbarui." });
  } catch (err) {
    console.error("PUT /api/layanan/:id error:", err);
    return res.status(500).json({ message: "Gagal memperbarui layanan." });
  }
});

// DELETE /api/layanan/:id — Hapus layanan
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM layanan WHERE id = ?", [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Layanan tidak ditemukan." });
    }
    return res.status(200).json({ message: "Layanan berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/layanan/:id error:", err);
    return res.status(500).json({ message: "Gagal menghapus layanan." });
  }
});

module.exports = router;