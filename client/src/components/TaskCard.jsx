import Avatar from "./Avatar";
import { priorityClass, formatDate } from "../lib/utils";
import { Calendar } from "lucide-react";

export default function TaskCard({ task, onClick }) {
  const overdue = task.status !== "DONE" && new Date(task.dueDate) < new Date();
  return (
    <div onClick={onClick} className="card p-3 cursor-pointer hover:shadow-md transition select-none">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm text-slate-900 line-clamp-2">{task.title}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${priorityClass(task.priority)}`}>{task.priority}</span>
      </div>
      {task.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>}
      <div className="mt-3 flex items-center justify-between">
        <div className={`flex items-center gap-1 text-xs ${overdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
          <Calendar size={12} /> {formatDate(task.dueDate)}
        </div>
        {task.assignee ? <Avatar name={task.assignee.name} size={24} /> : <span className="text-xs text-slate-400">Unassigned</span>}
      </div>
    </div>
  );
}
