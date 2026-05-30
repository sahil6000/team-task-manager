const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);

const projectSchema = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string().trim().max(2000).optional().nullable()
});

const userPublic = { id: true, name: true, email: true, role: true };

async function requireProjectAccess(req, res, next) {
  const projectId = req.params.id;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true }
  });
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  const isMember = project.members.some((m) => m.userId === req.user.id);
  if (!isMember && req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Forbidden" });
  req.project = project;
  next();
}

router.post("/", validate(projectSchema), requireAdmin, asyncHandler(async (req, res) => {
  const project = await prisma.project.create({
    data: {
      name: req.body.name,
      description: req.body.description ?? null,
      createdBy: req.user.id,
      members: { create: [{ userId: req.user.id }] }
    }
  });
  res.status(201).json({ success: true, project });
}));

router.get("/", asyncHandler(async (req, res) => {
  const where = req.user.role === "ADMIN" ? {} : { members: { some: { userId: req.user.id } } };
  const projects = await prisma.project.findMany({
    where,
    include: {
      _count: { select: { members: true, tasks: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, projects });
}));

router.get("/:id", asyncHandler(requireProjectAccess), asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      members: { include: { user: { select: userPublic } } },
      tasks: { include: { assignee: { select: userPublic } } }
    }
  });
  res.json({ success: true, project });
}));

router.put("/:id", asyncHandler(requireProjectAccess), requireAdmin, validate(projectSchema), asyncHandler(async (req, res) => {
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { name: req.body.name, description: req.body.description ?? null }
  });
  res.json({ success: true, project });
}));

router.delete("/:id", asyncHandler(requireProjectAccess), requireAdmin, asyncHandler(async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

router.post("/:id/members", asyncHandler(requireProjectAccess), requireAdmin,
  validate(z.object({ email: z.string().trim().toLowerCase().email() })),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ success: false, message: "No user with that email" });
    const exists = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: req.params.id, userId: user.id } }
    });
    if (exists) return res.status(400).json({ success: false, message: "User already a member" });
    await prisma.projectMember.create({ data: { projectId: req.params.id, userId: user.id } });
    res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  })
);

router.delete("/:id/members/:userId", asyncHandler(requireProjectAccess), requireAdmin, asyncHandler(async (req, res) => {
  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId: req.params.id, userId: req.params.userId } }
  });
  res.json({ success: true });
}));

module.exports = router;
