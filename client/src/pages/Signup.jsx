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
  const [role, setRole] = useState("MEMBER");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    try { await signup(name, email, password, role); nav("/dashboard"); }
    catch (e) { toast.error(e.response?.data?.message || "Signup failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white"><CheckSquare size={18}/></div>
          <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>TaskFlow</span>
        </div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Create your account</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Get started with your team today.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" required value={name} onChange={(e)=>setName(e.target.value)} /></div>
          <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
          <div><label className="label">Password</label><input className="input" type="password" required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button disabled={busy} className="btn-primary w-full">{busy ? "Creating…" : "Create account"}</button>
        </form>
        <p className="text-sm mt-4" style={{ color: "var(--text-secondary)" }}>Already have an account? <Link to="/login" className="text-brand-600 font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}
