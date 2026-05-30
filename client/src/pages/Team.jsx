import { useEffect, useState } from "react";
import api from "../api/client";
import Avatar from "../components/Avatar";

export default function Team() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get("/api/users").then((r) => setUsers(r.data.users)); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Team Directory</h1>
        <p className="text-slate-500 text-sm">People in your workspace</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="card p-5 flex items-center gap-4">
            <Avatar name={u.name} size={48} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{u.name}</div>
              <div className="text-sm text-slate-500 truncate">{u.email}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${u.role==="ADMIN" ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                <span className="text-xs text-slate-500">{u._count?.tasksAssigned ?? 0} tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
