# Team Task Manager

A production-ready collaborative task management web app — a simplified Trello/Asana-style workspace with role-based access, kanban boards, and analytics.

## Overview

Full-stack monorepo:
- **Frontend** (`/client`): React 18 + Vite + Tailwind CSS, Recharts charts, @hello-pangea/dnd kanban
- **Backend** (`/server`): Node.js + Express, Prisma ORM, JWT auth, Zod validation
- **Database**: PostgreSQL
- **Deployment**: Railway-ready (single service serves API + built SPA)

## Tech Stack

| Layer    | Stack                                                           |
|----------|-----------------------------------------------------------------|
| Frontend | React, React Router, Tailwind CSS, Recharts, @hello-pangea/dnd, axios, react-hot-toast, lucide-react |
| Backend  | Node.js, Express, Prisma, bcryptjs, jsonwebtoken, zod, cors, morgan |
| Database | PostgreSQL                                                      |
| Auth     | JWT (7-day expiry) + bcrypt password hashing (10 rounds)        |
| Hosting  | Railway                                                         |

## Project Structure

```
team-task-manager/
├── client/                  # React SPA (Vite)
│   ├── src/
│   │   ├── api/             # axios client + interceptors
│   │   ├── components/      # Sidebar, Layout, Modal, TaskCard, Avatar
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── pages/           # Login, Signup, Dashboard, Projects, ProjectDetail, Team, Settings
│   │   └── lib/             # utils
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                  # Express API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── index.js         # app bootstrap
│       ├── lib/prisma.js
│       ├── middleware/      # auth, validate, error
│       ├── routes/          # auth, projects, tasks, users, dashboard
│       └── utils/asyncHandler.js
└── package.json             # monorepo convenience scripts
```

## Local Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally (or any reachable Postgres URL)

### 2. Clone & install
```bash
git clone <repo>
cd team-task-manager
npm run install:all
```

### 3. Configure environment
```bash
cp server/.env.example server/.env
# Edit server/.env and set DATABASE_URL + JWT_SECRET
cp client/.env.example client/.env   # optional, defaults work with Vite proxy
```

`server/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/ttm?schema=public"
JWT_SECRET="replace-with-long-random-string"
CLIENT_URL="http://localhost:5173"
PORT=3001
NODE_ENV=development
```

### 4. Run migrations + seed
```bash
cd server
npx prisma migrate dev --name init
npm run seed         # optional: creates demo users + project
```

Demo logins (from seed):
- Admin:  `admin@demo.com` / `password123`
- Member: `member@demo.com` / `password123`

### 5. Start dev servers (two terminals)
```bash
# Terminal A
cd server && npm run dev

# Terminal B
cd client && npm run dev
```

Open http://localhost:5173

> The first user to sign up automatically becomes an `ADMIN`. All subsequent signups are `MEMBER`.

## Deployment on Railway

1. Push this repo to GitHub.
2. In Railway, create a **new project** → **Deploy from GitHub repo**.
3. Add a **PostgreSQL** plugin to the project. Railway will inject `DATABASE_URL`.
4. In your service settings, set environment variables:
   - `JWT_SECRET` — a long random string
   - `CLIENT_URL` — your Railway service URL (e.g. `https://your-app.up.railway.app`)
   - `NODE_ENV` — `production`
5. Set build & start commands:
   - **Install command:** `npm run install:all`
   - **Build command:** `npm run build` (builds client + generates Prisma client)
   - **Start command:** `cd server && npm run migrate && npm start`
6. Railway exposes `$PORT` automatically — the Express server reads it.

In production the Express server serves the built React SPA from `client/dist`, so there's a single deployable service.

## Environment Variables

| Name           | Where    | Description                                  |
|----------------|----------|----------------------------------------------|
| `DATABASE_URL` | server   | PostgreSQL connection string                 |
| `JWT_SECRET`   | server   | Secret used to sign JWTs                     |
| `CLIENT_URL`   | server   | Frontend origin for CORS                     |
| `PORT`         | server   | API port (Railway sets this automatically)   |
| `NODE_ENV`     | server   | `development` or `production`                |
| `VITE_API_URL` | client   | (optional) API base URL; empty uses Vite proxy / same-origin |

## API Documentation

All endpoints under `/api`. All except `/api/auth/*` require `Authorization: Bearer <token>`.

### Auth
| Method | Path                | Auth | Body                          | Response                          |
|--------|---------------------|------|-------------------------------|-----------------------------------|
| POST   | `/api/auth/signup`  | —    | `{ name, email, password }`   | `{ success, token, user }`        |
| POST   | `/api/auth/login`   | —    | `{ email, password }`         | `{ success, token, user }`        |
| GET    | `/api/auth/me`      | ✓    | —                             | `{ success, user }`               |

### Projects
| Method | Path                                       | Auth   | Notes                                 |
|--------|--------------------------------------------|--------|---------------------------------------|
| POST   | `/api/projects`                            | ADMIN  | Create project (creator auto-joined)  |
| GET    | `/api/projects`                            | ✓      | List (ADMIN: all; MEMBER: own only)   |
| GET    | `/api/projects/:id`                        | member | Project + members + tasks             |
| PUT    | `/api/projects/:id`                        | ADMIN  | Update name/description               |
| DELETE | `/api/projects/:id`                        | ADMIN  | Delete project                        |
| POST   | `/api/projects/:id/members`                | ADMIN  | Body: `{ email }` — adds existing user|
| DELETE | `/api/projects/:id/members/:userId`        | ADMIN  | Remove member                         |

### Tasks
| Method | Path                          | Auth   | Notes                                                                 |
|--------|-------------------------------|--------|-----------------------------------------------------------------------|
| POST   | `/api/tasks`                  | ADMIN  | Body: `{ projectId, title, dueDate, priority, status, assignedTo? }`  |
| GET    | `/api/tasks?projectId=…`      | member | List project tasks                                                    |
| GET    | `/api/tasks/:id`              | member | Single task                                                           |
| PUT    | `/api/tasks/:id`              | ✓      | ADMIN: any field. MEMBER: only `status`, only if assigned to them.    |
| DELETE | `/api/tasks/:id`              | ADMIN  | Delete task                                                           |

### Users
| Method | Path                       | Auth | Notes                                                          |
|--------|----------------------------|------|----------------------------------------------------------------|
| GET    | `/api/users`               | ✓    | ADMIN: all users. MEMBER: users in shared projects only.        |
| GET    | `/api/users/:id`           | ✓    | Profile + assigned tasks                                       |
| PUT    | `/api/users/me`            | ✓    | Body: `{ name }`                                               |
| PUT    | `/api/users/me/password`   | ✓    | Body: `{ currentPassword, newPassword }` — validates current   |

### Dashboard
| Method | Path                     | Auth | Response                                                                                          |
|--------|--------------------------|------|---------------------------------------------------------------------------------------------------|
| GET    | `/api/dashboard/stats`   | ✓    | `{ tasksByStatus, tasksByUser, totalTasks, overdueTasks, activeProjects, teamMembers, recent }`   |

### Error format
All errors return:
```json
{ "success": false, "message": "...", "errors": [{ "path": "field", "message": "..." }] }
```

## Features

- 🔐 **JWT auth + RBAC** — signup, login, bcrypt-hashed passwords, 7-day tokens, ADMIN/MEMBER roles
- 📁 **Projects** — create, list, view, update, delete; add/remove members by email lookup
- ✅ **Tasks** — full CRUD with title, description, due date, priority (Low/Med/High), status, assignee
- 🎯 **Kanban board** — three columns (To Do / In Progress / Done), drag-and-drop status updates (@hello-pangea/dnd). Members can only drag their own assigned tasks.
- 📊 **Dashboard analytics** — 4 stat cards (total/overdue/active projects/members), donut chart (tasks by status), horizontal bar chart (tasks per user), recent activity feed
- 🗂 **Team directory** — colored-initial avatars, role badges, task counts (ADMIN: all users; MEMBER: shared-project users)
- ⚙️ **Profile settings** — update name, change password (with current-password validation), view account info
- 🎨 **Responsive UI** — collapsible sidebar on mobile, works from 375px to 1440px, Inter font, slate + indigo palette
- 🛡️ **Production hardening** — Zod input validation, centralized error middleware, standardized JSON error responses, CORS allowlist, async error wrapper

## License

MIT
