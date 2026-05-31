<div align="center">

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/check-square.svg" width="80" height="80" style="filter: invert(1)" />

# ⚡ TaskFlow

### *The Team Task Manager That Actually Works in Production*

<br/>

[![Live App](https://img.shields.io/badge/🌐%20Live%20App-Open%20TaskFlow-6366F1?style=for-the-badge&logoColor=white)](https://team-task-manager-production-8f7d.up.railway.app)

<br/>

[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)](LICENSE)

<br/>

> **TaskFlow** is a production-deployed, full-stack Team Task Management application —
> a Trello + Asana hybrid built from the ground up with real authentication,
> role-based access control, live analytics dashboards, a drag-and-drop Kanban board,
> and a three-mode theme system. Every feature is live and functional.

<br/>

```
🌐  https://team-task-manager-production-8f7d.up.railway.app
📦  https://github.com/sahil6000/team-task-manager
```

<br/>

[🚀 Open App](https://team-task-manager-production-8f7d.up.railway.app) &nbsp;·&nbsp;
[📖 API Docs](#-api-documentation) &nbsp;·&nbsp;
[🛠 Local Setup](#-local-setup) &nbsp;·&nbsp;
[🚀 Deploy Guide](#-deployment-on-railway) &nbsp;·&nbsp;
[🔄 Rollback](#-rollback--recovery)

</div>

---

## 📋 Table of Contents

| # | Section | Description |
|---|---------|-------------|
| 01 | [✨ Why This Project](#-why-this-project) | What makes it different |
| 02 | [🎯 Overview](#-overview) | What it does |
| 03 | [🔥 Feature Snapshot](#-feature-snapshot) | Everything it has |
| 04 | [🏗 Architecture](#-architecture-overview) | How it's built |
| 05 | [🧰 Tech Stack](#-tech-stack) | Technologies used |
| 06 | [🗄 Database Schema](#-database-schema) | Data models |
| 07 | [🛠 Local Setup](#-local-setup) | Run it locally |
| 08 | [🚀 Deployment on Railway](#-deployment-on-railway) | Deploy to production |
| 09 | [📁 Project Structure](#-project-structure) | File tree |
| 10 | [📡 API Documentation](#-api-documentation) | All endpoints |
| 11 | [🔒 Role-Based Access Control](#-role-based-access-control) | Permissions |
| 12 | [🎨 Theme System](#-theme-system) | Three modes |
| 13 | [🔄 Rollback & Recovery](#-rollback--recovery) | Backup strategy |
| 14 | [📊 Project Status](#-project-status) | What's done |
| 15 | [📝 Running Notes](#-running-notes) | Important caveats |
| 16 | [🤝 Contributing](#-contributing) | How to help |
| 17 | [📄 License](#-license) | MIT |

---

## ✨ Why This Project

Most task manager tutorials stop at basic CRUD. **TaskFlow goes further** — it's a real-world, production-deployed application covering every layer a professional developer is evaluated on:

```
  ╔══════════════════════════════════════════════════════════════╗
  ║  🔐  Secure JWT auth with role-based access (not just login) ║
  ║  🗃  Relational DB design with cascades & proper relations   ║
  ║  📊  Live role-specific analytics dashboards                 ║
  ║  🎨  Three-mode theme engine using CSS custom properties     ║
  ║  🚀  Production deployment on Railway with PostgreSQL        ║
  ║  🧪  Async error handlers, Zod validation, Prisma ORM        ║
  ╚══════════════════════════════════════════════════════════════╝
```

This project was built as a full-stack coding assignment for **Ethara.AI** — evaluated on architecture, deployment, code quality, and real-world functionality.

---

## 🎯 Overview

**TaskFlow** is a collaborative workspace where teams create projects, assign tasks, and track progress — with clearly defined Admin and Member roles controlling exactly what each user can see and do.

| 🌐 Live Application | https://team-task-manager-production-8f7d.up.railway.app |
|---------------------|----------------------------------------------------------|
| 📦 Repository | https://github.com/sahil6000/team-task-manager |
| 🗄 Database | PostgreSQL (Railway managed, always-on) |
| 🚀 Deployment | Railway — auto-deploys on every push to `main` |
| 👨‍💻 Developer | Sahil Kumar |
| 📅 Status | ✅ Live & Fully Functional |

---

## 🔥 Feature Snapshot

### 🔐 Authentication System
- ✅ Signup with **Full Name, Email, Password + Role selection** (Admin / Member)
- ✅ Secure login returning **JWT token** (7-day expiry)
- ✅ Protected routes — unauthenticated users redirected to `/login`
- ✅ Token stored in `localStorage`, sent as `Authorization: Bearer <token>`
- ✅ `/api/auth/me` endpoint for token verification and user hydration

### 👑 Admin Features
- ✅ Create new projects (creator auto-assigned as Admin)
- ✅ Add team members by email lookup
- ✅ Remove members from projects
- ✅ Create tasks with Title, Description, Due Date, Priority, Assignee
- ✅ Edit and delete any task
- ✅ Drag and drop any task across Kanban columns
- ✅ Full team-wide dashboard with live charts

### 👤 Member Features
- ✅ View only projects they are added to
- ✅ View all tasks in their projects on the Kanban board
- ✅ Update status of tasks **assigned to them only**
- ✅ One-click status advancement buttons (To Do → In Progress → Done)
- ✅ Personal dashboard with own task stats and Kanban columns

### 📊 Dashboards

**Admin Dashboard:**

| Card | Shows |
|------|-------|
| 📋 Total Tasks | Count of all tasks across all projects |
| ⚠️ Overdue Tasks | Tasks past due date, status ≠ DONE |
| 📁 Active Projects | Total projects in workspace |
| 👥 Team Members | Unique members across all projects |

Plus:
- 🍩 **Tasks by Status** — Recharts PieChart (donut) with To Do / In Progress / Done
- 📊 **Tasks per User** — Recharts BarChart (horizontal) showing workload distribution
- 🕐 **Recent Activity** — Last 10 task events with project name, assignee, status badge, timestamp
- ➕ **New Project** quick action button

**Member Dashboard:**

| Card | Shows |
|------|-------|
| 📋 My Tasks | Tasks assigned specifically to this member |
| ⚠️ My Overdue Tasks | Their overdue tasks only |
| 📁 My Projects | Projects they belong to |

Plus:
- 🍩 Personal Tasks by Status donut chart
- 🗂 Three Kanban columns (To Do / In Progress / Done) with their own tasks
- ▶️ Status update buttons on each task card

### 🗂 Kanban Board
- ✅ Drag-and-drop via `@hello-pangea/dnd`
- ✅ Three columns: **To Do → In Progress → Done**
- ✅ Task cards show: title, description preview, due date, priority badge, assignee avatar
- ✅ Overdue tasks highlighted with **red left border**
- ✅ Click card → opens detail modal
- ✅ Admin sees Edit + Delete in modal; Member sees status update button

### 🎨 Three Theme Modes

| Mode | Icon | Background | Text | Special |
|------|------|-----------|------|---------|
| Light | ☀️ | `#F8FAFC` | `#0F172A` | Default |
| Dark | 🌙 | `#0F172A` | `#F1F5F9` | High contrast |
| Eye Save | 👁️ | `#2C2010` | `#F5E6C8` | Sepia + brightness filter |

Cycle button in sidebar. Preference saved to `localStorage` key `ttm_theme`.

---

## 🏗 Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │ AuthContext │  │ThemeContext │  │    React Router       │   │
│  │  JWT state  │  │ 3 CSS modes │  │  Protected Routes     │   │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬───────────┘   │
│         └────────────────┴──────────────────────┘               │
│                           │                                      │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                    Page Components                         │  │
│  │  Dashboard │ Projects │ ProjectDetail │ Team │ Settings   │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │ Axios (Bearer token)                 │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTPS / REST API
┌───────────────────────────▼──────────────────────────────────────┐
│                    EXPRESS.JS SERVER                              │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  /auth   │ │/projects │ │  /tasks  │ │   /dashboard     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│       │              │           │               │               │
│  ┌────▼──────────────▼───────────▼───────────────▼────────────┐ │
│  │  verifyToken  │  requireAdmin  │  Zod Validation  │  CORS  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           Prisma ORM                             │
└───────────────────────────┬──────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    POSTGRESQL DATABASE                            │
│                                                                   │
│   ┌─────────┐    ┌──────────────┐    ┌──────────┐               │
│   │  Users  │◄───│ProjectMembers│───►│ Projects │               │
│   └────┬────┘    └──────────────┘    └────┬─────┘               │
│        │                                   │                      │
│        └──────────────┬────────────────────┘                     │
│                       ▼                                          │
│                   ┌───────┐                                      │
│                   │ Tasks │                                      │
│                   └───────┘                                      │
│                                                                   │
│              Hosted on Railway (managed PostgreSQL)              │
└──────────────────────────────────────────────────────────────────┘
```

### Request Lifecycle
```
1. User action in React component
2. Axios call → Authorization: Bearer <jwt>
3. Express router receives request
4. verifyToken middleware decodes JWT → req.user
5. requireAdmin? checks role → 403 if unauthorized
6. Zod validation on req.body → 400 if invalid
7. Prisma query to PostgreSQL
8. JSON response → React state update → re-render
```

---

## 🧰 Tech Stack

### 🖥 Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19 | UI component framework |
| `vite` | 6 | Build tool & HMR dev server |
| `tailwindcss` | 3 | Utility-first CSS |
| `react-router-dom` | 6 | Client-side routing |
| `recharts` | 2 | Dashboard charts (Pie + Bar) |
| `@hello-pangea/dnd` | 1 | Drag-and-drop Kanban |
| `lucide-react` | 0.4 | Icon library |
| `react-hot-toast` | 2 | Toast notifications |
| `axios` | 1 | HTTP client with interceptors |

### ⚙️ Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 4 | Web framework |
| `@prisma/client` | 5 | Database ORM |
| `prisma` | 5 | Schema management & migrations |
| `bcryptjs` | 2 | Password hashing (bcrypt, 10 rounds) |
| `jsonwebtoken` | 9 | JWT sign & verify |
| `zod` | 3 | Request body schema validation |
| `cors` | 2 | Cross-origin request handling |
| `morgan` | 1 | HTTP request logging |
| `dotenv` | 16 | Environment variable loading |
| `nodemon` | 3 | Dev auto-restart |

### 🚀 Infrastructure

| Service | Purpose |
|---------|---------|
| **Railway** | App hosting + managed PostgreSQL |
| **GitHub** | Source control + auto-deploy trigger |
| **Nixpacks** | Auto-detected build system on Railway |
| **PostgreSQL 15** | Primary relational database |

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────┐
│            User                 │
├─────────────────────────────────┤
│  id           UUID  PK          │
│  name         TEXT  NOT NULL    │
│  email        TEXT  UNIQUE      │
│  passwordHash TEXT  NOT NULL    │
│  role         ENUM  ADMIN|MEMBER│
│  createdAt    TIMESTAMP         │
└──────────┬──────────────────────┘
           │                │
           │                │
    ┌──────▼──────┐   ┌─────▼──────────────────┐
    │ProjectMember│   │         Task            │
    ├─────────────┤   ├────────────────────────┤
    │ projectId FK│   │ id          UUID  PK    │
    │ userId    FK│   │ title       TEXT        │
    │ joinedAt    │   │ description TEXT        │
    └──────┬──────┘   │ dueDate     TIMESTAMP   │
           │          │ priority    LOW|MED|HIGH │
    ┌──────▼──────┐   │ status      TODO|IP|DONE│
    │   Project   │   │ assignedTo  FK → User   │
    ├─────────────┤   │ createdBy   FK → User   │
    │ id     UUID │   │ projectId   FK → Project│
    │ name   TEXT │   │ createdAt   TIMESTAMP   │
    │ desc   TEXT │   │ updatedAt   TIMESTAMP   │
    │ createdBy FK│   └────────────────────────┘
    │ createdAt   │
    └─────────────┘
```

### Prisma Schema Summary

```prisma
model User {
  id           String          @id @default(uuid())
  name         String
  email        String          @unique
  passwordHash String
  role         Role            @default(MEMBER)
  createdAt    DateTime        @default(now())
  projects     ProjectMember[]
  tasksAssigned Task[]         @relation("AssignedTasks")
  tasksCreated  Task[]         @relation("CreatedTasks")
  projectsCreated Project[]
}

model Project {
  id          String          @id @default(uuid())
  name        String
  description String?
  createdBy   String
  createdAt   DateTime        @default(now())
  members     ProjectMember[]
  tasks       Task[]
}

model ProjectMember {
  projectId String
  userId    String
  joinedAt  DateTime @default(now())
  @@id([projectId, userId])
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  dueDate     DateTime
  priority    Priority @default(MEDIUM)
  status      Status   @default(TODO)
  assignedTo  String?
  createdBy   String
  projectId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Role     { ADMIN MEMBER }
enum Priority { LOW MEDIUM HIGH }
enum Status   { TODO IN_PROGRESS DONE }
```

---

## 🛠 Local Setup

### Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | Any | `git --version` |
| PostgreSQL | Local OR Railway URL | `psql --version` |

### Step 1 — Clone & Install

```bash
git clone https://github.com/sahil6000/team-task-manager.git
cd team-task-manager

# Install all dependencies (root + client + server)
npm run install:all
```

### Step 2 — Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# JWT (use a long random string — min 32 characters)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# CORS
CLIENT_URL="http://localhost:5173"

# Server
PORT=3001
NODE_ENV=development
```

> 💡 **Tip:** If you don't have PostgreSQL locally, use your **Railway DATABASE_PUBLIC_URL** from the Railway dashboard.

### Step 3 — Setup Database

```bash
cd server

# Push schema to database (creates all tables)
npx prisma db push

# Optional: add demo users and sample data
node prisma/seed.js

cd ..
```

### Step 4 — Start Dev Servers

Open **two separate terminals**:

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
# ✅ Server running at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# ✅ App running at http://localhost:5173
```

### Step 5 — Open App

```
http://localhost:5173
```

**Demo credentials** (if you ran the seed):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `password123` |
| Member | `member@demo.com` | `password123` |

---

## 🚀 Deployment on Railway

### Step 1 — Create Railway Project

```
railway.app → Sign in with GitHub
→ New Project → Deploy from GitHub repo
→ Select: sahil6000/team-task-manager
→ Railway starts building automatically
```

### Step 2 — Add PostgreSQL

```
Railway Dashboard → + New → Database → PostgreSQL
→ DATABASE_URL automatically injected into your service ✅
```

### Step 3 — Set Environment Variables

Navigate to: `Service → Variables tab`

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | Any long random string |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your Railway app URL |

### Step 4 — Generate Public Domain

```
Service → Settings → Networking → Generate Domain
→ https://your-app-name.up.railway.app
```

### Step 5 — Verify Deployment

```
Service → Deployments → View Logs

Expected output:
✅ Prisma schema loaded
✅ The database is already in sync
✅ API listening on :8080
```

### Railway Configuration

```toml
# railway.toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && cd client && npm install && npm run build && cd ../server && npm install"

[deploy]
startCommand = "cd server && npx prisma db push --accept-data-loss && node src/index.js"
restartPolicyType = "ON_FAILURE"
```

### Deployment vs Development Comparison

| Setting | Development | Production |
|---------|-------------|------------|
| Database | Local PostgreSQL | Railway PostgreSQL |
| Frontend URL | `localhost:5173` | `*.up.railway.app` |
| API URL | `localhost:3001` | Same railway domain |
| NODE_ENV | `development` | `production` |
| Build | Vite HMR | `vite build` → static |
| Auto-deploy | No | ✅ Every push to `main` |

---

## 📁 Project Structure

```
team-task-manager/
│
├── 📄 railway.toml                    ← Railway build + start config
├── 📄 package.json                    ← Root scripts (install:all)
├── 📄 README.md
├── 📄 .gitignore
│
├── 📁 client/                         ← React frontend (Vite)
│   ├── 📄 index.html
│   ├── 📄 vite.config.js              ← Proxy /api → localhost:3001
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   └── 📁 src/
│       ├── 📄 App.jsx                 ← Route definitions
│       ├── 📄 main.jsx                ← Entry point, providers
│       ├── 📄 index.css               ← CSS variables (3 themes)
│       │
│       ├── 📁 api/
│       │   └── 📄 client.js           ← Axios + auth interceptor
│       │
│       ├── 📁 context/
│       │   ├── 📄 AuthContext.jsx     ← JWT state, login/signup/logout
│       │   └── 📄 ThemeContext.jsx    ← Theme cycle, localStorage
│       │
│       ├── 📁 components/
│       │   ├── 📄 Layout.jsx          ← App shell + sidebar
│       │   ├── 📄 Sidebar.jsx         ← Nav, theme toggle, user info
│       │   ├── 📄 TaskCard.jsx        ← Kanban card component
│       │   ├── 📄 Modal.jsx           ← Reusable modal wrapper
│       │   ├── 📄 Avatar.jsx          ← Initials avatar circle
│       │   └── 📄 ProtectedRoute.jsx  ← Auth guard
│       │
│       ├── 📁 pages/
│       │   ├── 📄 Dashboard.jsx       ← Role-split (Admin/Member)
│       │   ├── 📄 Login.jsx
│       │   ├── 📄 Signup.jsx          ← With role dropdown
│       │   ├── 📄 Projects.jsx        ← Project grid + create
│       │   ├── 📄 ProjectDetail.jsx   ← Kanban board + members
│       │   ├── 📄 Team.jsx            ← Team directory
│       │   └── 📄 Settings.jsx        ← Profile + password
│       │
│       └── 📁 lib/
│           └── 📄 utils.js            ← Shared helpers
│
└── 📁 server/                         ← Express backend
    ├── 📄 package.json
    ├── 📄 .env.example
    │
    ├── 📁 prisma/
    │   ├── 📄 schema.prisma           ← DB models + enums
    │   └── 📄 seed.js                 ← Demo data seeder
    │
    └── 📁 src/
        ├── 📄 index.js                ← Express app bootstrap
        │
        ├── 📁 lib/
        │   └── 📄 prisma.js           ← Prisma client singleton
        │
        ├── 📁 middleware/
        │   ├── 📄 auth.js             ← verifyToken + requireAdmin
        │   ├── 📄 validate.js         ← Zod schema middleware
        │   └── 📄 error.js            ← Global error handler
        │
        ├── 📁 routes/
        │   ├── 📄 auth.js             ← /signup /login /me
        │   ├── 📄 projects.js         ← CRUD + member management
        │   ├── 📄 tasks.js            ← CRUD + status updates
        │   ├── 📄 users.js            ← User list + profile
        │   └── 📄 dashboard.js        ← Admin + member stats
        │
        └── 📁 utils/
            └── 📄 asyncHandler.js     ← try/catch wrapper
```

---

## 📡 API Documentation

**Base URL:**
```
Production → https://team-task-manager-production-8f7d.up.railway.app/api
Local      → http://localhost:3001/api
```

**Auth Header:**
```
Authorization: Bearer <jwt_token>
```

---

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/auth/signup` | ❌ | Register new user with role |
| `POST` | `/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/auth/me` | ✅ | Get current user |

**POST /auth/signup**
```json
// Request
{ "name": "Sahil Kumar", "email": "sahil@example.com", "password": "secret123", "role": "ADMIN" }

// Response 201
{ "success": true, "token": "eyJhbGci...", "user": { "id": "uuid", "name": "Sahil Kumar", "email": "sahil@example.com", "role": "ADMIN" } }
```

**POST /auth/login**
```json
// Request
{ "email": "sahil@example.com", "password": "secret123" }

// Response 200
{ "success": true, "token": "eyJhbGci...", "user": { ... } }
```

---

### 📁 Projects — `/api/projects`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|:----:|-------------|
| `GET` | `/projects` | ✅ | Any | List projects (filtered by role) |
| `POST` | `/projects` | ✅ | Admin | Create project |
| `GET` | `/projects/:id` | ✅ | Any | Get project + members + tasks |
| `PUT` | `/projects/:id` | ✅ | Admin | Update project |
| `DELETE` | `/projects/:id` | ✅ | Admin | Delete project |
| `POST` | `/projects/:id/members` | ✅ | Admin | Add member by email |
| `DELETE` | `/projects/:id/members/:userId` | ✅ | Admin | Remove member |

**POST /projects**
```json
// Request
{ "name": "My Project", "description": "Project description here" }

// Response 201
{ "success": true, "project": { "id": "uuid", "name": "My Project", ... } }
```

---

### ✅ Tasks — `/api/tasks`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|:----:|-------------|
| `GET` | `/tasks?projectId=` | ✅ | Any | List tasks for project |
| `POST` | `/tasks` | ✅ | Admin | Create task |
| `GET` | `/tasks/:id` | ✅ | Any | Get single task |
| `PUT` | `/tasks/:id` | ✅ | Any* | Update task (*member: status only) |
| `DELETE` | `/tasks/:id` | ✅ | Admin | Delete task |

**POST /tasks**
```json
// Request
{
  "title": "Design Landing Page",
  "description": "Create wireframe and mockup",
  "dueDate": "2026-06-30T00:00:00.000Z",
  "priority": "HIGH",
  "status": "TODO",
  "assignedTo": "user-uuid-here",
  "projectId": "project-uuid-here"
}

// Response 201
{ "success": true, "task": { "id": "uuid", "title": "Design Landing Page", ... } }
```

---

### 👥 Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/users` | ✅ | List all users with task counts |
| `GET` | `/users/:id` | ✅ | Get user profile |
| `PUT` | `/users/me` | ✅ | Update own name |
| `PUT` | `/users/me/password` | ✅ | Change password |

---

### 📊 Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|:----:|-------------|
| `GET` | `/dashboard/admin-stats` | ✅ | Admin | Full team analytics |
| `GET` | `/dashboard/member-stats` | ✅ | Member | Personal task stats |

**GET /dashboard/admin-stats — Response:**
```json
{
  "totalTasks": 12,
  "overdueTasks": 2,
  "activeProjects": 3,
  "teamMembers": 5,
  "tasksByStatus": { "TODO": 4, "IN_PROGRESS": 6, "DONE": 2 },
  "tasksByUser": [
    { "name": "Alice", "count": 4 },
    { "name": "Bob", "count": 3 }
  ],
  "recent": [
    {
      "id": "uuid",
      "title": "Design Homepage",
      "project": { "name": "TaskFlow Demo" },
      "assignee": { "name": "Alice" },
      "status": "IN_PROGRESS",
      "updatedAt": "2026-05-31T06:38:20Z"
    }
  ]
}
```

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": [ { "field": "email", "message": "Invalid email format" } ]
}
```

| Status Code | Meaning |
|-------------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (wrong role) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## 🔒 Role-Based Access Control

```
╔══════════════════════════════════════════════════════════╗
║                     ADMIN PERMISSIONS                     ║
╠══════════════════════════════════════════════════════════╣
║  ✅  Create, edit, delete projects                        ║
║  ✅  Add and remove team members                          ║
║  ✅  Create tasks and assign to any member                ║
║  ✅  Edit all task fields (title, date, priority, etc.)   ║
║  ✅  Delete any task                                      ║
║  ✅  Drag any task card on Kanban board                   ║
║  ✅  View full team dashboard + all charts                ║
║  ✅  See all projects and all tasks                       ║
╚══════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════╗
║                    MEMBER PERMISSIONS                     ║
╠══════════════════════════════════════════════════════════╣
║  ✅  View projects they are added to                      ║
║  ✅  View all tasks in their projects                     ║
║  ✅  Update status of tasks assigned to them              ║
║  ✅  Drag their own task cards on Kanban board            ║
║  ✅  View personal dashboard with own task stats          ║
║  ❌  Cannot create or delete projects                     ║
║  ❌  Cannot create, edit, or delete tasks                 ║
║  ❌  Cannot add or remove members                         ║
║  ❌  Cannot see team-wide analytics                       ║
╚══════════════════════════════════════════════════════════╝
```

### Permission Matrix

| Action | Admin | Member |
|--------|:-----:|:------:|
| Create project | ✅ | ❌ |
| View own projects | ✅ | ✅ |
| Add member to project | ✅ | ❌ |
| Remove member | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Edit task (all fields) | ✅ | ❌ |
| Update task status | ✅ | ✅ (own only) |
| Delete task | ✅ | ❌ |
| Drag any Kanban card | ✅ | ❌ |
| Drag own Kanban card | ✅ | ✅ |
| Admin dashboard | ✅ | ❌ |
| Member dashboard | ✅ | ✅ |

---

## 🎨 Theme System

Three CSS-variable-driven themes, toggled via sidebar button:

```css
/* ── LIGHT MODE (default) ── */
:root {
  --bg-page:        #F8FAFC;
  --bg-card:        #FFFFFF;
  --bg-sidebar:     #0F172A;
  --text-primary:   #0F172A;
  --text-secondary: #64748B;
  --border:         #E2E8F0;
}

/* ── DARK MODE ── */
html.dark {
  --bg-page:        #0F172A;
  --bg-card:        #1E293B;
  --bg-sidebar:     #020617;
  --text-primary:   #F1F5F9;
  --text-secondary: #94A3B8;
  --border:         #334155;
}

/* ── EYE SAVE MODE ── */
html.eyesave {
  --bg-page:        #2C2010;
  --bg-card:        #352818;
  --bg-sidebar:     #1A1208;
  --text-primary:   #F5E6C8;
  --text-secondary: #C4A882;
  --border:         #5C4020;
  filter: sepia(20%) brightness(0.92);
}
```

**ThemeContext (`client/src/context/ThemeContext.jsx`):**
```jsx
const THEMES = ["light", "dark", "eyesave"];

const cycle = () => {
  const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  setTheme(next);  // updates html class + localStorage
};
```

Sidebar toggle cycles: ☀️ Light → 🌙 Dark → 👁️ Eye Save → ☀️ Light

---

## 🔄 Rollback & Recovery

This project uses a **dual-branch backup strategy** so any breaking change can be reverted within minutes.

### Backup Branch Map

```
GitHub Repository
├── main                    ← Live code (Railway deploys from here)
├── backup-v2-working       ← ✅ Full featured: themes + dashboards
└── backup-working-version  ← ✅ Original working deployment
```

### 🔙 Rollback to V2 (Recommended — Most Recent)

Use this if new features break the app:

```bash
git reset --hard backup-v2-working
git add .
git commit -m "rollback to v2"
git push origin main
```

### 🔙 Rollback to Original

Use this if everything is broken completely:

```bash
git reset --hard backup-working-version
git add .
git commit -m "Rollback to working backup version"
git push origin main
```

> ✅ After either rollback, Railway auto-detects the push and redeploys from `main` within ~2 minutes.

### 🔒 Creating a New Backup Before Risky Changes

```bash
# Always do this before making major changes
git checkout -b backup-v3-working
git push -u origin backup-v3-working
git checkout main

# Now make your changes safely
```

### Recovery Timeline

```
You push rollback → GitHub receives push → Railway detects change
→ Railway builds (~60s) → Railway deploys → App live again
Total time: ~2-3 minutes
```

---

## 📊 Project Status

| Feature | Status | Notes |
|---------|:------:|-------|
| JWT Authentication | ✅ Complete | Signup + Login + /me |
| Role selection on signup | ✅ Complete | Admin / Member dropdown |
| Project CRUD | ✅ Complete | Create, Read, Update, Delete |
| Member management | ✅ Complete | Add by email, remove |
| Task CRUD | ✅ Complete | All fields + assignment |
| Kanban drag-and-drop | ✅ Complete | @hello-pangea/dnd |
| Admin dashboard | ✅ Complete | Charts + stats + activity |
| Member dashboard | ✅ Complete | Personal kanban + stats |
| Three theme modes | ✅ Complete | Light / Dark / Eye Save |
| Railway deployment | ✅ Live | Auto-deploy from main |
| PostgreSQL database | ✅ Live | Managed by Railway |
| Responsive design | ✅ Complete | Mobile + desktop |
| Team directory | ✅ Complete | All users + task counts |
| Profile settings | ✅ Complete | Edit name + password |
| Input validation | ✅ Complete | Zod on all POST/PUT |
| Error handling | ✅ Complete | Global async handler |

---

## 📝 Running Notes

```
⚠️  RAILWAY FREE TIER
    Includes $5 credit — no credit card required.
    App may sleep after inactivity (15-30 mins).
    First request after sleep takes ~10 seconds to wake.

⚠️  DATABASE APPROACH
    Uses `prisma db push` instead of `prisma migrate deploy`.
    This is intentional — Railway free tier has no shell access
    for running migrations interactively. db push is safe and
    correct for this application's scale.

⚠️  ROLE ASSIGNMENT
    Role is chosen at signup and cannot be changed from the UI.
    Choose carefully: Admin or Member.
    To change a role, update the User table directly in Railway's
    database browser.

✅  AUTO-DEPLOY
    Every git push to main branch triggers Railway to rebuild
    and redeploy. Full deployment takes ~2-3 minutes.

✅  CORS CONFIGURATION
    Currently configured for Railway domain and localhost:5173.
    Update CLIENT_URL environment variable if you use a custom domain.

✅  JWT EXPIRY
    Tokens expire after 7 days. Users are automatically logged out
    and redirected to /login on token expiry.
```

---

## 🤝 Contributing

Contributions are welcome! Here's the workflow:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/team-task-manager.git

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Make your changes and test locally

# 5. Commit with conventional commit message
git commit -m "feat: add task checklist with progress bar"

# 6. Push to your fork
git push origin feat/your-feature-name

# 7. Open a Pull Request on GitHub
```

### Commit Convention

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI / CSS changes only |
| `refactor:` | Code restructure, no behavior change |
| `docs:` | Documentation updates |
| `chore:` | Build config, dependencies |
| `test:` | Adding or updating tests |

### Code Style Guidelines

- Frontend: Functional React components with hooks only
- Backend: `asyncHandler` wrapper on all route handlers
- Validation: Zod schemas for all POST/PUT request bodies
- Errors: Always return `{ success: false, message: "..." }`
- CSS: Use CSS variables (`var(--bg-card)`) — never hardcode colors

---

## 📄 License

```
MIT License

Copyright (c) 2026 Sahil Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

---

### 🌐 Live Application

<a href="https://team-task-manager-production-8f7d.up.railway.app">
  <img src="https://img.shields.io/badge/🚀_Open_TaskFlow_Now-team--task--manager--production--8f7d.up.railway.app-6366F1?style=for-the-badge" alt="Open TaskFlow"/>
</a>

<br/><br/>

**Built with ❤️ and a lot of ☕ by**

## Sahil Kumar

*Full-Stack Developer · React · Node.js · PostgreSQL · Railway*

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-@sahil6000-181717?style=flat-square&logo=github)](https://github.com/sahil6000)
[![Email](https://img.shields.io/badge/Email-sahilkumar829112@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:sahilkumar829112@gmail.com)

<br/>

---

*If this project helped you, please consider giving it a* ⭐ *on GitHub!*

*It means a lot and helps others discover it.*

---

</div>
