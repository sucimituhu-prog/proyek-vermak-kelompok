const express = require("express");
const cors    = require("cors");
const app     = express();
const PORT    = 5000;

app.use(cors());
app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const customerRoutes = require("./routes/customerRoutes");
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Vermak berjalan ✅" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});