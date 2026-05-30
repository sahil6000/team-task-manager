import { useEffect, useState } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../lib/utils";

export default function Settings() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  useEffect(() => setName(user?.name || ""), [user]);

  const saveName = async (e) => {
    e.preventDefault();
    try { await api.put("/api/users/me", { name }); await refresh(); toast.success("Saved"); }
    catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast.error("Passwords don't match");
    try {
      await api.put("/api/users/me/password", { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success("Password updated");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-semibold">Profile Settings</h1></div>

      <form onSubmit={saveName} className="card p-6 space-y-4">
        <h3 className="font-semibold">Personal info</h3>
        <div><label className="label">Full name</label><input className="input" value={name} onChange={(e)=>setName(e.target.value)} /></div>
        <div><label className="label">Email</label><input className="input bg-slate-50 text-slate-500" value={user?.email || ""} disabled /></div>
        <button className="btn-primary">Save changes</button>
      </form>

      <form onSubmit={changePw} className="card p-6 space-y-4">
        <h3 className="font-semibold">Change password</h3>
        <div><label className="label">Current password</label><input className="input" type="password" required value={pw.currentPassword} onChange={(e)=>setPw({...pw,currentPassword:e.target.value})} /></div>
        <div><label className="label">New password</label><input className="input" type="password" required minLength={6} value={pw.newPassword} onChange={(e)=>setPw({...pw,newPassword:e.target.value})} /></div>
        <div><label className="label">Confirm new password</label><input className="input" type="password" required value={pw.confirm} onChange={(e)=>setPw({...pw,confirm:e.target.value})} /></div>
        <button className="btn-primary">Update password</button>
      </form>

      <div className="card p-6 space-y-2">
        <h3 className="font-semibold">Account info</h3>
        <div className="text-sm"><span className="text-slate-500">Role:</span> <span className="font-medium">{user?.role}</span></div>
        <div className="text-sm"><span className="text-slate-500">Member since:</span> <span className="font-medium">{formatDate(user?.createdAt)}</span></div>
      </div>
    </div>
  );
}
