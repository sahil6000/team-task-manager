import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ListTodo, AlertTriangle, FolderKanban, Users, Plus, Clock, CheckCircle, Circle, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const STATUS_COLORS = { TODO: "#94A3B8", IN_PROGRESS: "#6366F1", DONE: "#10B981" };
const PRIORITY_COLORS = { LOW: "#10B981", MEDIUM: "#F59E0B", HIGH: "#EF4444" };
const STATUS_LABELS = { TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done" };
const NEXT_STATUS = { TODO: "IN_PROGRESS", IN_PROGRESS: "DONE" };
const STATUS_ICONS = { TODO: Circle, IN_PROGRESS: Loader, DONE: CheckCircle };

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{label}</div>
          <div className={`text-3xl font-semibold mt-1 ${accent || ""}`} style={!accent ? { color: "var(--text-primary)" } : {}}>{value}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><Icon size={20} /></div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/admin-stats").then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Loading...</div>;
  if (!stats) return <div style={{ color: "var(--text-secondary)" }}>Failed to load stats.</div>;

  const statusData = Object.entries(stats.tasksByStatus).map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Dashboard</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Overview of your tasks and team</p>
        </div>
        <Link to="/projects" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600">
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={stats.totalTasks} />
        <StatCard icon={AlertTriangle} label="Overdue Tasks" value={stats.overdueTasks} accent="text-red-500" />
        <StatCard icon={FolderKanban} label="Active Projects" value={stats.activeProjects} />
        <StatCard icon={Users} label="Team Members" value={stats.teamMembers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Tasks by Status</h3>
          {stats.totalTasks === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-secondary)" }}>No tasks yet.</div>
          ) : (
            <div style={{ height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {statusData.map((e, i) => <Cell key={i} fill={Object.values(STATUS_COLORS)[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Tasks per User</h3>
          {stats.tasksByUser.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm" style={{ color: "var(--text-secondary)" }}>No tasks assigned yet.</div>
          ) : (
            <div style={{ height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={stats.tasksByUser} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" allowDecimals={false} stroke="var(--text-secondary)" />
                  <YAxis dataKey="name" type="category" width={100} stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  <Bar dataKey="count" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Recent Activity</h3>
        <ul className="space-y-2">
          {stats.recent.length === 0 && <li className="text-sm" style={{ color: "var(--text-secondary)" }}>No activity yet.</li>}
          {stats.recent.map((t) => (
            <li key={t.id} className="flex items-center justify-between text-sm pb-2 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <div>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{t.title}</span>
                <span style={{ color: "var(--text-secondary)" }}> · {t.project?.name}</span>
                {t.assignee && <span style={{ color: "var(--text-secondary)" }}> → {t.assignee.name}</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: STATUS_COLORS[t.status] + "22", color: STATUS_COLORS[t.status] }}>{STATUS_LABELS[t.status]}</span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{new Date(t.updatedAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MemberDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/api/dashboard/member-stats").then((r) => setStats(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status: newStatus });
      toast.success(`Moved to ${STATUS_LABELS[newStatus]}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <div style={{ color: "var(--text-secondary)" }}>Loading...</div>;
  if (!stats) return <div style={{ color: "var(--text-secondary)" }}>Failed to load stats.</div>;

  const statusData = Object.entries(stats.tasksByStatus).map(([k, v]) => ({ name: STATUS_LABELS[k] || k, value: v }));

  const todoTasks = stats.myTasks.filter(t => t.status === "TODO");
  const inProgressTasks = stats.myTasks.filter(t => t.status === "IN_PROGRESS");
  const doneTasks = stats.myTasks.filter(t => t.status === "DONE");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>My Dashboard</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Your tasks and progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={ListTodo} label="My Tasks" value={stats.totalMyTasks} />
        <StatCard icon={AlertTriangle} label="My Overdue Tasks" value={stats.myOverdueTasks} accent="text-red-500" />
        <StatCard icon={FolderKanban} label="My Projects" value={stats.myActiveProjects} />
      </div>

      {stats.totalMyTasks > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>My Tasks by Status</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {statusData.map((e, i) => <Cell key={i} fill={Object.values(STATUS_COLORS)[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "To Do", tasks: todoTasks, status: "TODO", color: "#94A3B8" },
          { label: "In Progress", tasks: inProgressTasks, status: "IN_PROGRESS", color: "#6366F1" },
          { label: "Done", tasks: doneTasks, status: "DONE", color: "#10B981" }
        ].map(({ label, tasks, status, color }) => (
          <div key={status} className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: color }}></div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{label}</h3>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: color + "22", color }}>{tasks.length}</span>
            </div>
            {tasks.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: "var(--text-secondary)" }}>No tasks</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((t) => {
                  const isOverdue = t.status !== "DONE" && new Date(t.dueDate) < new Date();
                  const StatusIcon = STATUS_ICONS[t.status];
                  return (
                    <li key={t.id} className="p-3 rounded-lg border" style={{ borderColor: isOverdue ? "#EF4444" : "var(--border)", background: "var(--bg-column)", borderLeftWidth: isOverdue ? "3px" : "1px" }}>
                      <div className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>{t.title}</div>
                      <div className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{t.project?.name}</div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: PRIORITY_COLORS[t.priority] + "22", color: PRIORITY_COLORS[t.priority] }}>{t.priority}</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: isOverdue ? "#EF4444" : "var(--text-secondary)" }}>
                            <Clock size={10} />{new Date(t.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {NEXT_STATUS[t.status] && (
                          <button
                            onClick={() => updateStatus(t.id, NEXT_STATUS[t.status])}
                            className="text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1 transition hover:opacity-80"
                            style={{ background: STATUS_COLORS[NEXT_STATUS[t.status]] + "22", color: STATUS_COLORS[NEXT_STATUS[t.status]] }}
                          >
                            <StatusIcon size={10} />
                            → {STATUS_LABELS[NEXT_STATUS[t.status]]}
                          </button>
                        )}
                        {t.status === "DONE" && (
                          <span className="text-xs flex items-center gap-1" style={{ color: "#10B981" }}>
                            <CheckCircle size={12} /> Completed
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "ADMIN" ? <AdminDashboard /> : <MemberDashboard />;
}
