const router = require("express").Router();
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

const userPublic = { id: true, name: true, email: true, role: true, createdAt: true };

router.get("/", asyncHandler(async (req, res) => {
  let users;
  if (req.user.role === "ADMIN") {
    users = await prisma.user.findMany({
      select: { ...userPublic, _count: { select: { tasksAssigned: true } } },
      orderBy: { name: "asc" }
    });
  } else {
    const myProjects = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
      select: { projectId: true }
    });
    const ids = myProjects.map((p) => p.projectId);
    users = await prisma.user.findMany({
      where: { projects: { some: { projectId: { in: ids } } } },
      select: { ...userPublic, _count: { select: { tasksAssigned: true } } },
      orderBy: { name: "asc" }
    });
  }
  res.json({ success: true, users });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { ...userPublic, tasksAssigned: { include: { project: { select: { id: true, name: true } } } } }
  });
  if (!user) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, user });
}));

router.put("/me", validate(z.object({ name: z.string().trim().min(1).max(100) })), asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name: req.body.name },
    select: userPublic
  });
  res.json({ success: true, user });
}));

router.put("/me/password", validate(z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(200)
})), asyncHandler(async (req, res) => {
  const ok = await bcrypt.compare(req.body.currentPassword, req.user.passwordHash);
  if (!ok) return res.status(400).json({ success: false, message: "Current password incorrect" });
  const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
  res.json({ success: true });
}));

module.exports = router;
