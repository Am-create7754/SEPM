import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    console.log("Attempting signup with:", { name, email, role }); // Debugging

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { 
        name, 
        email, 
        password, 
        role 
      });
      
      console.log("Signup Response:", res.data);
      alert("Account created successfully ✅");
      navigate("/login");
    } catch (err) {
      console.error("Signup Error Object:", err);
      // Agar backend 404 de raha hai, matlab URL galat hai ya route register nahi hua
      const errMsg = err.response?.data?.message || "Registration failed (Check if Backend Server is running)";
      alert(errMsg + " ❌");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010806] text-white">
      <form onSubmit={handleSignup} className="w-80 bg-black border border-emerald-500/20 p-8 rounded-2xl space-y-5 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-emerald-500 tracking-tight">CREATE ACCOUNT</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Join the CricScore Arena</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-emerald-500/50 uppercase ml-1">Full Name</label>
            <input
              type="text"
              placeholder="Virat Kohli"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[#050505] border border-emerald-500/10 rounded-xl text-sm focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-emerald-500/50 uppercase ml-1">Email Address</label>
            <input
              type="email"
              placeholder="virat@king.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#050505] border border-emerald-500/10 rounded-xl text-sm focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-emerald-500/50 uppercase ml-1">Secret Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#050505] border border-emerald-500/10 rounded-xl text-sm focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-emerald-500/50 uppercase ml-1">I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#050505] border border-emerald-500/10 rounded-xl text-sm focus:border-emerald-500/50 outline-none transition-all appearance-none text-emerald-100"
            >
              <option value="player">Player (Wants to play)</option>
              <option value="organiser">Organiser (Wants to host)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-emerald-500 text-[#010806] font-black rounded-xl hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all uppercase tracking-wider text-xs">
          Register Now
        </button>

        <p className="text-[11px] text-center text-slate-500 font-medium">
          Already a legend? <Link to="/login" className="text-emerald-500 hover:underline ml-1">Login here</Link>
        </p>
      </form>
    </div>
  );
}