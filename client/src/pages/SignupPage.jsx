import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../utils/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player"); // 🔥 default role
  const navigate = useNavigate();

  function handleSignup(e) {
    e.preventDefault();

    const success = signupUser(name, email, password, role);

    if (!success) {
      alert("User already exists");
      return;
    }

    alert("Account created successfully ✅");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#010806] text-white">
      <form
        onSubmit={handleSignup}
        className="w-80 bg-black border border-emerald-500/20 p-6 rounded-xl space-y-4"
      >
        <h2 className="text-lg font-semibold text-center">Signup</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-slate-700 rounded-md text-sm"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-slate-700 rounded-md text-sm"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-slate-700 rounded-md text-sm"
        />

        {/* Role Selector */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-black border border-slate-700 text-sm"
        >
          <option value="player">Signup as Player</option>
          <option value="organiser">Signup as Organiser</option>
        </select>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-2 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition"
        >
          Signup
        </button>

        <p className="text-xs text-center text-slate-400">
          Already have account?{" "}
          <Link to="/login" className="text-emerald-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
