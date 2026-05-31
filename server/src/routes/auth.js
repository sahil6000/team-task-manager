const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken } = require("../middleware/auth");

const signupSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(200),
  role: z.enum(["ADMIN", "MEMBER"]).optional()
});
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

const sign = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sanitize = ({ passwordHash, ...u }) => u;

router.post("/signup", validate(signupSchema), asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ success: false, message: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const userRole = role === "ADMIN" ? "ADMIN" : "MEMBER";
  const user = await prisma.user.create({ data: { name, email, passwordHash, role: userRole } });
  res.status(201).json({ success: true, token: sign(user), user: sanitize(user) });
}));

router.post("/login", validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });
  res.json({ success: true, token: sign(user), user: sanitize(user) });
}));

router.get("/me", verifyToken, asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
}));

module.exports = router;
