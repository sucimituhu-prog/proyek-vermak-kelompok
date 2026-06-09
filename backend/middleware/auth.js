const jwt    = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "vermak_al_ziran_secret_key";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa." });
  }
}

module.exports = authMiddleware;