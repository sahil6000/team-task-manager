import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import { Plus, FolderKanban, Users as UsersIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/api/projects").then((r) => setProjects(r.data.projects));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/projects", { name, description: desc });
      toast.success("Project created");
      setOpen(false); setName(""); setDesc(""); load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Projects</h1>
          <p className="text-slate-500 text-sm">Workspaces you're a part of</p>
        </div>
        {user?.role === "ADMIN" && (
          <button onClick={() => setOpen(true)} className="btn-primary"><Plus size={16}/> New Project</button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`} className="card p-5 hover:shadow-md transition">
            <div className="flex items-center gap-2 text-brand-600 mb-2"><FolderKanban size={18}/></div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">{p.description || "No description"}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><UsersIcon size={14}/> {p._count.members} members</span>
              <span>{p._count.tasks} tasks</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <div className="text-slate-500 col-span-full">No projects yet.</div>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create project"
        footer={<>
          <button className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button form="newp" className="btn-primary" disabled={busy}>{busy ? "Creating…" : "Create"}</button>
        </>}>
        <form id="newp" onSubmit={create} className="space-y-4">
          <div><label className="label">Name</label><input className="input" required value={name} onChange={(e)=>setName(e.target.value)} /></div>
          <div><label className="label">Description</label><textarea className="input" rows={3} value={desc} onChange={(e)=>setDesc(e.target.value)} /></div>
        </form>
      </Modal>
    </div>
  );
}
