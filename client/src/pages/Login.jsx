import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { CheckSquare } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await login(email, password); nav("/dashboard"); }
    catch (e) { toast.error(e.response?.data?.message || "Login failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white"><CheckSquare size={18}/></div>
          <span className="font-semibold text-lg">TaskFlow</span>
        </div>
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in to your workspace</p>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
          <div><label className="label">Password</label><input className="input" type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="text-sm text-slate-500 mt-4">No account? <Link to="/signup" className="text-brand-600 font-medium">Sign up</Link></p>
      </div>
    </div>
  );
}
