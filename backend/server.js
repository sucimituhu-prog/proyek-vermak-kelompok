const express = require("express");
const cors    = require("cors");
const path    = require("path");
const app     = express();
const PORT    = 5000;

app.use(cors());
app.use(express.json());

// Serve folder uploads/
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes    = require("./routes/authRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const layananRoutes = require("./routes/layananRoutes");
const authMiddleware = require("./middleware/auth");

// Auth — tidak perlu token
app.use("/api/auth", authRoutes);

// Publik — cek pesanan boleh tanpa token
app.get("/api/orders/cek/:id", (req, res, next) => {
  orderRoutes.handle(req, res, next);
});

// Semua route admin butuh token
app.use("/api/orders",  authMiddleware, orderRoutes);
app.use("/api/layanan", authMiddleware, layananRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Vermak berjalan ✅" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});