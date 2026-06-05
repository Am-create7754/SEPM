import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // 🔥 Axios add kiya

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      // 🔥 Backend API hit kar rahe hain
      const res = await axios.post("http://127.0.0.1:5001/api/auth/login", { email, password });

      // Token aur user info save karo
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful ✅");
      navigate("/");
      window.location.reload(); // Taaki navbar/sidebar update ho jaye
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials ❌");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010806] text-white">
      <form onSubmit={handleLogin} className="w-80 bg-black border border-emerald-500/20 p-8 rounded-2xl space-y-5 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-emerald-500 tracking-tight">WELCOME BACK</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Log in to CricScore Arena</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-emerald-500/50 uppercase ml-1">Email Address</label>
            <input
              type="email"
              placeholder="type your email.."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#050505] border border-emerald-500/10 rounded-xl text-sm focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-emerald-500/50 uppercase ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#050505] border border-emerald-500/10 rounded-xl text-sm focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-emerald-500 text-[#010806] font-black rounded-xl hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-wider text-xs">
          Login Now
        </button>

        <p className="text-[11px] text-center text-slate-500 font-medium">
          Don't have account? <Link to="/signup" className="text-emerald-500 hover:underline ml-1">Signup here</Link>
        </p>
      </form>
    </div>
  );
}