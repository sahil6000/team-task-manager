import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { CheckSquare } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    try { await signup(name, email, password); nav("/dashboard"); }
    catch (e) { toast.error(e.response?.data?.message || "Signup failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white"><CheckSquare size={18}/></div>
          <span className="font-semibold text-lg">TaskFlow</span>
        </div>
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6">The first user becomes the admin</p>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Full name</label><input className="input" required value={name} onChange={(e)=>setName(e.target.value)} /></div>
          <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
          <div><label className="label">Password</label><input className="input" type="password" required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Creating…" : "Create account"}</button>
        </form>
        <p className="text-sm text-slate-500 mt-4">Have an account? <Link to="/login" className="text-brand-600 font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}
