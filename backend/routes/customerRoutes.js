const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/customers — semua pelanggan
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("GET /api/customers error:", err);
    return res.status(500).json({ message: "Gagal mengambil data pelanggan." });
  }
});

// GET /api/customers/:id — detail pelanggan
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM customers WHERE id = ?", [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan." });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("GET /api/customers/:id error:", err);
    return res.status(500).json({ message: "Gagal mengambil data pelanggan." });
  }
});

// POST /api/customers — tambah pelanggan
router.post("/", async (req, res) => {
  const { name, email, phone, service, height, weight, chest, waist, hips } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Nama, email, dan telepon wajib diisi." });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO customers
         (name, email, phone, service, height, weight, chest, waist, hips)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, service || null, height || null, weight || null, chest || null, waist || null, hips || null]
    );

    return res.status(201).json({
      message: "Pelanggan berhasil ditambahkan.",
      customerId: result.insertId,
    });
  } catch (err) {
    console.error("POST /api/customers error:", err);
    return res.status(500).json({ message: "Gagal menambahkan pelanggan." });
  }
});

// PUT /api/customers/:id — update pelanggan
router.put("/:id", async (req, res) => {
  const { name, email, phone, service, height, weight, chest, waist, hips } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE customers SET
         name = ?, email = ?, phone = ?, service = ?,
         height = ?, weight = ?, chest = ?, waist = ?, hips = ?
       WHERE id = ?`,
      [name, email, phone, service || null, height || null, weight || null, chest || null, waist || null, hips || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan." });
    }

    return res.status(200).json({ message: "Data pelanggan berhasil diperbarui." });
  } catch (err) {
    console.error("PUT /api/customers/:id error:", err);
    return res.status(500).json({ message: "Gagal memperbarui data pelanggan." });
  }
});

// DELETE /api/customers/:id — hapus pelanggan
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM customers WHERE id = ?", [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pelanggan tidak ditemukan." });
    }
    return res.status(200).json({ message: "Pelanggan berhasil dihapus." });
  } catch (err) {
    console.error("DELETE /api/customers/:id error:", err);
    return res.status(500).json({ message: "Gagal menghapus pelanggan." });
  }
});

module.exports = router;

