import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Users, Settings, LogOut, CheckSquare, Menu, Sun, Moon, Eye } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "My Projects", icon: FolderKanban },
  { to: "/team", label: "Team Directory", icon: Users },
  { to: "/settings", label: "Profile Settings", icon: Settings }
];

function ThemeButton({ theme, cycle }) {
  const icons = { light: Sun, dark: Moon, eyesave: Eye };
  const labels = { light: "Light", dark: "Dark", eyesave: "Eye Save" };
  const colors = { light: "#FCD34D", dark: "#818CF8", eyesave: "#86EFAC" };
  const Icon = icons[theme];
  return (
    <button
      onClick={cycle}
      title={`Switch theme (current: ${labels[theme]})`}
      style={{ color: colors[theme] }}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition hover:bg-white/5"
    >
      <Icon size={18} />
      <span>{labels[theme]} Mode</span>
    </button>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, cycle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-3 left-3 z-30 p-2 rounded-lg border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        onClick={() => setOpen(!open)}
      >
        <Menu size={20} />
      </button>

      <aside
        className={`fixed md:static z-20 inset-y-0 left-0 w-60 flex flex-col transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: "var(--bg-sidebar)", color: "var(--text-sidebar)" }}
      >
        <div className="px-5 py-5 flex items-center gap-2 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="font-semibold tracking-tight text-white">TaskFlow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition border-l-4 ${
                  isActive
                    ? "bg-brand-500/15 border-brand-500 text-white"
                    : "border-transparent hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <it.icon size={18} />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-white/10 space-y-1">
          <ThemeButton theme={theme} cycle={cycle} />
          <div className="px-3 py-2 text-xs" style={{ color: "var(--text-sidebar)" }}>
            <div className="text-white font-medium">{user?.name}</div>
            <div>{user?.email}</div>
            <div className="mt-1 inline-block px-2 py-0.5 rounded bg-brand-500/20 text-brand-500 text-[10px] font-semibold">
              {user?.role}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white"
            style={{ color: "var(--text-sidebar)" }}
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
