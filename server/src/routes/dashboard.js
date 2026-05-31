const router = require("express").Router();
const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken);

router.get("/admin-stats", asyncHandler(async (req, res) => {
  const tasks = await prisma.task.findMany({
    include: {
      assignee: { select: { id: true, name: true } },
      project: { select: { name: true } },
      creator: { select: { name: true } }
    }
  });

  const tasksByStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  const userMap = new Map();
  const now = new Date();
  let overdueTasks = 0;

  for (const t of tasks) {
    tasksByStatus[t.status] = (tasksByStatus[t.status] || 0) + 1;
    if (t.status !== "DONE" && new Date(t.dueDate) < now) overdueTasks++;
    const key = t.assignee?.id || "unassigned";
    const name = t.assignee?.name || "Unassigned";
    userMap.set(key, { name, count: (userMap.get(key)?.count || 0) + 1 });
  }

  const projects = await prisma.project.findMany({
    select: { id: true, members: { select: { userId: true } } }
  });

  const memberIds = new Set();
  projects.forEach((p) => p.members.forEach((m) => memberIds.add(m.userId)));

  const recent = await prisma.task.findMany({
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

router.get("/member-stats", asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();

  const myTasks = await prisma.task.findMany({
    where: { assignedTo: userId },
    include: { project: { select: { name: true } } },
    orderBy: { dueDate: "asc" }
  });

  const tasksByStatus = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  let myOverdue = 0;

  for (const t of myTasks) {
    tasksByStatus[t.status] = (tasksByStatus[t.status] || 0) + 1;
    if (t.status !== "DONE" && new Date(t.dueDate) < now) myOverdue++;
  }

  const myProjects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
    select: { id: true }
  });

  res.json({
    success: true,
    myTasks,
    tasksByStatus,
    totalMyTasks: myTasks.length,
    myOverdueTasks: myOverdue,
    myActiveProjects: myProjects.length
  });
}));

router.get("/stats", asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "ADMIN";
  const projectFilter = isAdmin ? {} : { project: { members: { some: { userId: req.user.id } } } };
  const tasks = await prisma.task.findMany({
    where: projectFilter,
    include: { assignee: { select: { id: true, name: true } }, project: { select: { name: true } }, creator: { select: { name: true } } }
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
    where: projectFilter, orderBy: { updatedAt: "desc" }, take: 10,
    include: { assignee: { select: { name: true } }, project: { select: { name: true } }, creator: { select: { name: true } } }
  });
  res.json({ success: true, tasksByStatus, tasksByUser: Array.from(userMap.values()).sort((a, b) => b.count - a.count), totalTasks: tasks.length, overdueTasks, activeProjects: projects.length, teamMembers: memberIds.size, recent });
}));

module.exports = router;
