const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const verifyToken = async (req, res, next) => {
  try {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Missing token" });
    const payload = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ success: false, message: "Admin only" });
  next();
};

module.exports = { verifyToken, requireAdmin };
