const express = require("express");
const cors    = require("cors");
const path    = require("path");
const app     = express();
const PORT    = 5000;

app.use(cors());
app.use(express.json());

// Serve folder uploads/ agar foto bisa diakses dari frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const orderRoutes   = require("./routes/orderRoutes");
const layananRoutes = require("./routes/layananRoutes");

app.use("/api/orders",  orderRoutes);
app.use("/api/layanan", layananRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Vermak berjalan ✅" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});