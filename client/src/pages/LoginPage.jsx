import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("player"); // 🔥 default role
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const success = loginUser(email, password, role);

    if (!success) {
      alert("Invalid credentials or wrong role selected");
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010806] text-white">
      <form
        onSubmit={handleLogin}
        className="w-80 bg-black border border-emerald-500/20 p-6 rounded-xl space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-3 py-2 bg-black border border-slate-700 rounded-md text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full px-3 py-2 bg-black border border-slate-700 rounded-md text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />



        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition"
        >
          Login
        </button>

        <p className="text-xs text-center text-slate-400">
          Don't have account?{" "}
          <Link to="/signup" className="text-emerald-400">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
