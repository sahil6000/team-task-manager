const router = require("express").Router();
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/stats", asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "ADMIN";
  const projectFilter = isAdmin
    ? {}
    : { project: { members: { some: { userId: req.user.id } } } };

  const tasks = await prisma.task.findMany({
    where: projectFilter,
    include: { assignee: { select: { id: true, name: true } } }
  });

  const tasksByStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  const userMap = new Map();
  const now = new Date();
  let overdueTasks = 0;
  for (const t of tasks) {
    tasksByStatus[t.status]++;
    if (t.status !== "DONE" && new Date(t.dueDate) < now) overdueTasks++;
    const key = t.assignee?.id || "unassigned";
    const name = t.assignee?.name || "Unassigned";
    userMap.set(key, { name, count: (userMap.get(key)?.count || 0) + 1 });
  }

  const projects = await prisma.project.findMany({
    where: isAdmin ? {} : { members: { some: { userId: req.user.id } } },
    select: { id: true, members: { select: { userId: true } } }
  });
  const memberIds = new Set();
  projects.forEach((p) => p.members.forEach((m) => memberIds.add(m.userId)));

  const recent = await prisma.task.findMany({
    where: projectFilter,
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      assignee: { select: { name: true } },
      project: { select: { name: true } },
      creator: { select: { name: true } }
    }
  });

  res.json({
    success: true,
    tasksByStatus,
    tasksByUser: Array.from(userMap.values()).sort((a, b) => b.count - a.count),
    totalTasks: tasks.length,
    overdueTasks,
    activeProjects: projects.length,
    teamMembers: memberIds.size,
    recent
  });
}));

module.exports = router;
