import { useEffect, useState } from "react";
import api from "../api/client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ListTodo, AlertTriangle, FolderKanban, Users } from "lucide-react";

const STATUS_COLORS = { TODO: "#94A3B8", IN_PROGRESS: "#6366F1", DONE: "#10B981" };

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
          <div className={`text-3xl font-semibold mt-1 ${accent || "text-slate-900"}`}>{value}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center"><Icon size={20} /></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { api.get("/api/dashboard/stats").then((r) => setStats(r.data)); }, []);

  if (!stats) return <div className="text-slate-500">Loading…</div>;

  const statusData = Object.entries(stats.tasksByStatus).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-500 text-sm">Overview of your tasks and team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={stats.totalTasks} />
        <StatCard icon={AlertTriangle} label="Overdue Tasks" value={stats.overdueTasks} accent="text-red-600" />
        <StatCard icon={FolderKanban} label="Active Projects" value={stats.activeProjects} />
        <StatCard icon={Users} label="Team Members" value={stats.teamMembers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Tasks by Status</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {statusData.map((e) => <Cell key={e.name} fill={STATUS_COLORS[e.name]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">Tasks per User</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={stats.tasksByUser} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          {stats.recent.map((t) => (
            <li key={t.id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0">
              <div>
                <span className="font-medium">{t.title}</span>
                <span className="text-slate-500"> · {t.project?.name}</span>
              </div>
              <span className="text-xs text-slate-400">{new Date(t.updatedAt).toLocaleString()}</span>
            </li>
          ))}
          {stats.recent.length === 0 && <li className="text-sm text-slate-500">No activity yet.</li>}
        </ul>
      </div>
    </div>
  );
}
