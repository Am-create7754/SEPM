// src/Navbar.jsx
import { logoutUser, getUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    logoutUser();
    navigate("/login"); // login page
  }

  // 🔥 Role Detection
  const role = user?.role;

  const roleLabel =
    role === "superadmin"
      ? "Super Admin"
      : role === "organiser"
      ? "Admin Mode"
      : "Player Mode";

  const roleColor =
    role === "player"
      ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
      : "text-blue-300 border-blue-500/30 bg-blue-500/10";

  return (
    <header
      className="
        h-14 px-6 flex items-center justify-between
        bg-gradient-to-b
        from-[#051510]
        via-[#051510]
        to-[#041511]
        border-b border-emerald-500/20
      "
    >
      {/* Left Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/90 flex items-center justify-center text-xs font-semibold text-emerald-950 shadow-sm">
          CS
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-emerald-300">
            CricScore
          </p>
          <p className="text-[11px] text-slate-400 tracking-wide">
            TOURNAMENT MANAGEMENT
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">

        {/* 🔥 Dynamic Role Badge */}
        {user && (
          <div
            className={`
              px-3 py-1 text-[11px] rounded-full
              border flex items-center gap-1
              ${roleColor}
            `}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {roleLabel}
          </div>
        )}

        {/* Logout */}
        <button
          className="
            px-3 py-1 text-[11px] rounded-full
            bg-emerald-500/10
            border border-emerald-500/30
            text-emerald-300
            hover:bg-emerald-500/15
            transition
          "
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </header>
  );
}
