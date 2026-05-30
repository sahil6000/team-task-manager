import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import Avatar from "../components/Avatar";
import { Plus, Trash2, UserPlus, Edit2 } from "lucide-react";
import { statusLabel, formatDate, priorityClass } from "../lib/utils";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"];

function TaskFormModal({ open, onClose, onSubmit, initial, members }) {
  const [t, setT] = useState({ title: "", description: "", dueDate: "", priority: "MEDIUM", status: "TODO", assignedTo: "" });
  useEffect(() => {
    if (initial) setT({
      title: initial.title, description: initial.description || "",
      dueDate: initial.dueDate?.slice(0, 10) || "",
      priority: initial.priority, status: initial.status,
      assignedTo: initial.assignedTo || ""
    });
    else setT({ title: "", description: "", dueDate: "", priority: "MEDIUM", status: "TODO", assignedTo: "" });
  }, [initial, open]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...t,
      dueDate: new Date(t.dueDate).toISOString(),
      assignedTo: t.assignedTo || null,
      description: t.description || null
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit task" : "Create task"}
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button form="taskf" className="btn-primary">{initial ? "Save" : "Create"}</button>
      </>}>
      <form id="taskf" onSubmit={submit} className="space-y-3">
        <div><label className="label">Title</label><input className="input" required value={t.title} onChange={(e)=>setT({...t,title:e.target.value})} /></div>
        <div><label className="label">Description</label><textarea className="input" rows={3} value={t.description} onChange={(e)=>setT({...t,description:e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Due date</label><input className="input" type="date" required value={t.dueDate} onChange={(e)=>setT({...t,dueDate:e.target.value})} /></div>
          <div><label className="label">Priority</label>
            <div className="flex gap-1">
              {["LOW","MEDIUM","HIGH"].map(p => (
                <button type="button" key={p} onClick={()=>setT({...t,priority:p})}
                  className={`flex-1 text-xs py-2 rounded-lg border font-medium ${t.priority===p ? priorityClass(p) : "border-slate-200 text-slate-500"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Status</label>
            <select className="input" value={t.status} onChange={(e)=>setT({...t,status:e.target.value})}>
              {COLUMNS.map(c => <option key={c} value={c}>{statusLabel(c)}</option>)}
            </select>
          </div>
          <div><label className="label">Assignee</label>
            <select className="input" value={t.assignedTo} onChange={(e)=>setT({...t,assignedTo:e.target.value})}>
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskModal, setTaskModal] = useState({ open: false, initial: null });
  const [memberEmail, setMemberEmail] = useState("");
  const [detail, setDetail] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  const load = async () => {
    const { data } = await api.get(`/api/projects/${id}`);
    setProject(data.project);
    setTasks(data.project.tasks);
  };
  useEffect(() => { load(); }, [id]);

  const byCol = useMemo(() => {
    const g = { TODO: [], IN_PROGRESS: [], DONE: [] };
    tasks.forEach((t) => g[t.status].push(t));
    return g;
  }, [tasks]);

  const onDragEnd = async (res) => {
    if (!res.destination) return;
    const newStatus = res.destination.droppableId;
    const task = tasks.find((t) => t.id === res.draggableId);
    if (!task || task.status === newStatus) return;
    if (!isAdmin && task.assignedTo !== user.id) return toast.error("Only the assignee can move this task");
    const prev = tasks;
    setTasks(tasks.map((t) => t.id === task.id ? { ...t, status: newStatus } : t));
    try { await api.put(`/api/tasks/${task.id}`, { status: newStatus }); }
    catch (e) { setTasks(prev); toast.error(e.response?.data?.message || "Failed to move"); }
  };

  const saveTask = async (data) => {
    try {
      if (taskModal.initial) await api.put(`/api/tasks/${taskModal.initial.id}`, data);
      else await api.post("/api/tasks", { ...data, projectId: id });
      toast.success("Saved");
      setTaskModal({ open: false, initial: null });
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try { await api.delete(`/api/tasks/${taskId}`); toast.success("Deleted"); setDetail(null); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/projects/${id}/members`, { email: memberEmail });
      toast.success("Member added");
      setMemberEmail(""); load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };
  const removeMember = async (uid) => {
    if (!confirm("Remove this member?")) return;
    try { await api.delete(`/api/projects/${id}/members/${uid}`); toast.success("Removed"); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  if (!project) return <div className="text-slate-500">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{project.description}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setTaskModal({ open: true, initial: null })} className="btn-primary"><Plus size={16}/> New Task</button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <div key={col} className="bg-slate-100 rounded-xl p-3 min-h-[400px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-sm text-slate-700">{statusLabel(col)}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium">{byCol[col].length}</span>
                </div>
                <Droppable droppableId={col}>
                  {(prov) => (
                    <div ref={prov.innerRef} {...prov.droppableProps} className="space-y-2 min-h-[200px]">
                      {byCol[col].map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}
                          isDragDisabled={!isAdmin && task.assignedTo !== user.id}>
                          {(p) => (
                            <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                              <TaskCard task={task} onClick={() => setDetail(task)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {prov.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        <aside className="card p-5">
          <h3 className="font-semibold mb-3">Members ({project.members.length})</h3>
          <ul className="space-y-2">
            {project.members.map((m) => (
              <li key={m.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <Avatar name={m.user.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{m.user.email}</div>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${m.user.role==="ADMIN" ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-600"}`}>{m.user.role}</span>
                {isAdmin && m.userId !== user.id && (
                  <button onClick={() => removeMember(m.userId)} className="text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                )}
              </li>
            ))}
          </ul>
          {isAdmin && (
            <form onSubmit={addMember} className="mt-4 flex gap-2">
              <input className="input" type="email" placeholder="user@email.com" required value={memberEmail} onChange={(e)=>setMemberEmail(e.target.value)} />
              <button className="btn-primary"><UserPlus size={16}/></button>
            </form>
          )}
        </aside>
      </div>

      <TaskFormModal open={taskModal.open} initial={taskModal.initial}
        onClose={() => setTaskModal({ open: false, initial: null })}
        onSubmit={saveTask} members={project.members} />

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Task details" maxWidth="max-w-xl"
        footer={isAdmin && detail ? <>
          <button className="btn-danger" onClick={() => deleteTask(detail.id)}><Trash2 size={14}/> Delete</button>
          <button className="btn-secondary" onClick={() => { setTaskModal({ open: true, initial: detail }); setDetail(null); }}><Edit2 size={14}/> Edit</button>
        </> : null}>
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold">{detail.title}</h2>
              <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${priorityClass(detail.priority)}`}>{detail.priority}</span>
            </div>
            {detail.description && <p className="text-slate-600 whitespace-pre-wrap">{detail.description}</p>}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div><div className="text-xs text-slate-500">Status</div><div className="font-medium">{statusLabel(detail.status)}</div></div>
              <div><div className="text-xs text-slate-500">Due date</div><div className="font-medium">{formatDate(detail.dueDate)}</div></div>
              <div><div className="text-xs text-slate-500">Assignee</div><div className="font-medium">{detail.assignee?.name || "Unassigned"}</div></div>
            </div>
            {!isAdmin && detail.assignedTo === user.id && detail.status !== "DONE" && (
              <button className="btn-primary w-full mt-3" onClick={async () => {
                const next = detail.status === "TODO" ? "IN_PROGRESS" : "DONE";
                await api.put(`/api/tasks/${detail.id}`, { status: next });
                toast.success(`Moved to ${statusLabel(next)}`);
                setDetail(null); load();
              }}>Move to {statusLabel(detail.status === "TODO" ? "IN_PROGRESS" : "DONE")}</button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
