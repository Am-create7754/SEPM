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
      <form onSubmit={handleLogin} className="w-80 bg-black border border-emerald-500/20 p-6 rounded-xl space-y-4 shadow-2xl">
        <h2 className="text-xl font-bold text-center text-emerald-500">Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-3 py-2 bg-[#010806] border border-slate-700 rounded-md text-sm focus:border-emerald-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full px-3 py-2 bg-[#010806] border border-slate-700 rounded-md text-sm focus:border-emerald-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full py-2 bg-emerald-500 text-black font-bold rounded-md hover:bg-emerald-400 transition">
          Login
        </button>
        <p className="text-xs text-center text-slate-400">
          Don't have account? <Link to="/signup" className="text-emerald-400">Signup</Link>
        </p>
      </form>
    </div>
  );
}