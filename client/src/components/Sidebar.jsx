import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Users, Settings, LogOut, CheckSquare, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "My Projects", icon: FolderKanban },
  { to: "/team", label: "Team Directory", icon: Users },
  { to: "/settings", label: "Profile Settings", icon: Settings }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="md:hidden fixed top-3 left-3 z-30 p-2 rounded-lg bg-white border border-slate-200"
        onClick={() => setOpen(!open)}><Menu size={20} /></button>

      <aside className={`fixed md:static z-20 inset-y-0 left-0 w-60 bg-ink text-slate-100 flex flex-col transition-transform
                        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="px-5 py-5 flex items-center gap-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center"><CheckSquare size={18}/></div>
          <span className="font-semibold tracking-tight">TaskFlow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition border-l-4 ${
                  isActive ? "bg-brand-500/15 border-brand-500 text-white" : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                }`}>
              <it.icon size={18} />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-white/10">
          <div className="px-3 py-2 text-xs text-slate-400">
            <div className="text-slate-200 font-medium">{user?.name}</div>
            <div>{user?.email}</div>
            <div className="mt-1 inline-block px-2 py-0.5 rounded bg-brand-500/20 text-brand-500 text-[10px] font-semibold">{user?.role}</div>
          </div>
          <button onClick={logout} className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white">
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
