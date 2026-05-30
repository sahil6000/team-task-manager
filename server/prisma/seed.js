const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const pwd = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: { name: "Ada Admin", email: "admin@demo.com", passwordHash: pwd, role: "ADMIN" }
  });
  const member = await prisma.user.upsert({
    where: { email: "member@demo.com" },
    update: {},
    create: { name: "Mel Member", email: "member@demo.com", passwordHash: pwd, role: "MEMBER" }
  });
  const project = await prisma.project.create({
    data: {
      name: "Launch Website",
      description: "Marketing site rebuild",
      createdBy: admin.id,
      members: { create: [{ userId: admin.id }, { userId: member.id }] }
    }
  });
  await prisma.task.createMany({
    data: [
      { title: "Design hero", dueDate: new Date(Date.now() + 86400000 * 3), priority: "HIGH", status: "TODO", assignedTo: member.id, projectId: project.id, createdBy: admin.id },
      { title: "Setup analytics", dueDate: new Date(Date.now() + 86400000 * 7), priority: "MEDIUM", status: "IN_PROGRESS", assignedTo: admin.id, projectId: project.id, createdBy: admin.id },
      { title: "Write copy", dueDate: new Date(Date.now() - 86400000), priority: "LOW", status: "TODO", assignedTo: member.id, projectId: project.id, createdBy: admin.id }
    ]
  });
  console.log("Seeded. Logins: admin@demo.com / member@demo.com — password: password123");
}
main().finally(() => prisma.$disconnect());
