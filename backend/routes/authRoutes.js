const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "vermak_al_ziran_secret_key";

// 1 akun admin — hardcode (tidak perlu tabel users)
const ADMIN = {
  username: "admin",
  password: "alziran123",
};

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi." });
  }

  if (username !== ADMIN.username || password !== ADMIN.password) {
    return res.status(401).json({ message: "Username atau password salah." });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "8h" });
  return res.status(200).json({ message: "Login berhasil.", token });
});

// GET /api/auth/verify — cek token masih valid
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    return res.status(200).json({ valid: true });
  } catch {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;