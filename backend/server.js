const express = require("express");
const cors    = require("cors");
const path    = require("path");
const app     = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Serve folder uploads/
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes     = require("./routes/authRoutes");
const orderRoutes    = require("./routes/orderRoutes");
const layananRoutes  = require("./routes/layananRoutes");
const customerRoutes = require("./routes/customerRoutes");
const authMiddleware = require("./middleware/auth");
const db             = require("./config/db");

// Auth — tidak perlu token
app.use("/api/auth", authRoutes);

// Publik — cek pesanan tanpa token (harus SEBELUM authMiddleware)
app.get("/api/orders/cek/:id", async (req, res) => {
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
    console.error("GET /cek/:id error:", err);
    return res.status(500).json({ message: "Gagal mengambil data." });
  }
});

// Semua route admin butuh token
app.use("/api/orders",    authMiddleware, orderRoutes);
app.use("/api/layanan",   authMiddleware, layananRoutes);
app.use("/api/customers", authMiddleware, customerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Vermak berjalan ✅" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});