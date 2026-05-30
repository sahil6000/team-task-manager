const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { verifyToken, requireAdmin } = require("../middleware/auth");

router.use(verifyToken);

const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  dueDate: z.coerce.date(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  assignedTo: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid()
});

const taskUpdateSchema = taskCreateSchema.partial().omit({ projectId: true });

const userPublic = { id: true, name: true, email: true, role: true };

async function userInProject(userId, projectId) {
  const m = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });
  return !!m;
}

router.post("/", requireAdmin, validate(taskCreateSchema), asyncHandler(async (req, res) => {
  const task = await prisma.task.create({
    data: { ...req.body, createdBy: req.user.id },
    include: { assignee: { select: userPublic } }
  });
  res.status(201).json({ success: true, task });
}));

router.get("/", asyncHandler(async (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ success: false, message: "projectId required" });
  if (req.user.role !== "ADMIN" && !(await userInProject(req.user.id, projectId))) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: { assignee: { select: userPublic } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ success: true, tasks });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: { assignee: { select: userPublic }, creator: { select: userPublic } }
  });
  if (!task) return res.status(404).json({ success: false, message: "Not found" });
  if (req.user.role !== "ADMIN" && !(await userInProject(req.user.id, task.projectId))) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  res.json({ success: true, task });
}));

router.put("/:id", validate(taskUpdateSchema), asyncHandler(async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  if (!task) return res.status(404).json({ success: false, message: "Not found" });

  if (req.user.role === "ADMIN") {
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
      include: { assignee: { select: userPublic } }
    });
    return res.json({ success: true, task: updated });
  }

  // Member: only status, only on tasks assigned to them
  if (task.assignedTo !== req.user.id) {
    return res.status(403).json({ success: false, message: "You can only update tasks assigned to you" });
  }
  const keys = Object.keys(req.body);
  if (keys.length !== 1 || keys[0] !== "status") {
    return res.status(403).json({ success: false, message: "Members can only update status" });
  }
  const updated = await prisma.task.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
    include: { assignee: { select: userPublic } }
  });
  res.json({ success: true, task: updated });
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

module.exports = router;
