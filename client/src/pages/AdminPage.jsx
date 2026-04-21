import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import {
  Trophy,
  Activity,
  BarChart3,
  Users,
  Plus,
  CalendarDays,
  Settings,
} from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);

  /* =========================
     FETCH DB DATA
  ==========================*/
  useEffect(() => {
    async function fetchAdminData() {
      try {
        const token = localStorage.getItem("token");
        const [tournRes, matchRes] = await Promise.all([
          fetch("http://localhost:5001/api/tournaments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5001/api/matches", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const tournData = await tournRes.json();
        const matchData = await matchRes.json();

        setTournaments(Array.isArray(tournData) ? tournData : []);
        setMatches(Array.isArray(matchData) ? matchData : []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    }
    
    fetchAdminData();
  }, []);

  /* =========================
     Derived Stats
  ==========================*/
  const totalTournaments = tournaments.length;

  const totalMatches = matches.length;

  const liveMatches = matches.filter(
    (m) => m.status?.toLowerCase() === "live"
  ).length;

  const totalTeams = tournaments.reduce(
    (acc, t) => acc + (t.teams?.length || 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />

        <main className="flex-1 px-8 lg:px-24 py-8 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-emerald-50">
                Admin Dashboard
              </h1>
              <p className="text-sm text-emerald-400 mt-1">
                Manage tournaments and matches
              </p>
            </div>
          </div>

          {/* =========================
             Stats
          ========================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Stat
              title="Tournaments"
              value={totalTournaments}
              icon={<Trophy size={16} />}
            />

            <Stat
              title="Live Matches"
              value={liveMatches}
              highlight
              icon={<Activity size={16} />}
            />

            <Stat
              title="Total Matches"
              value={totalMatches}
              icon={<BarChart3 size={16} />}
            />

            <Stat
              title="Teams"
              value={totalTeams}
              icon={<Users size={16} />}
            />
          </div>

          {/* =========================
             Quick Actions
          ========================== */}
          <h2 className="text-lg font-bold text-emerald-50 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <ActionCard
              title="Create Tournament"
              desc="Set up a new tournament"
              icon={<Trophy size={18} />}
              onClick={() => navigate("/admin/create-tournament")}
            />

            <ActionCard
              title="Schedule Match"
              desc="Manage tournament matches"
              icon={<CalendarDays size={18} />}
              onClick={() => navigate("/tournaments")}
            />

            <ActionCard
              title="Manage Teams"
              desc="View and manage teams"
              icon={<Users size={18} />}
              onClick={() => navigate("/profile/team")}
            />

            <ActionCard
              title="Settings"
              desc="System configuration"
              icon={<Settings size={18} />}
              onClick={() => navigate("/admin/settings")}
            />
          </div>

          {/* =========================
             Active Tournaments
          ========================== */}
          <h2 className="text-lg font-bold text-emerald-50 mb-4">
            Active Tournaments
          </h2>

          <div className="space-y-4">
            {tournaments.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] to-[#041511] p-6 text-slate-400 text-sm text-center">
                No tournaments created yet.
              </div>
            ) : (
              tournaments.map((t) => (
                <TournamentRow
                  key={t._id} // 🔥 Fix: Using MongoDB _id
                  title={t.name}
                  subtitle={`${t.matches?.length || 0} matches · ${
                    t.teams?.length || 0
                  } teams`}
                  status={
                    t.matches?.some((m) => m.status?.toLowerCase() === "live")
                      ? "LIVE"
                      : "ACTIVE"
                  }
                  statusColor={
                    t.matches?.some((m) => m.status?.toLowerCase() === "live")
                      ? "orange"
                      : "emerald"
                  }
                  onClick={() =>
                    navigate(`/tournaments/${t._id}`) // 🔥 Fix: Routing to exact ID
                  }
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Stat({ title, value, icon, highlight }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 shadow-[0_0_25px_rgba(16,185,129,0.08)] transition-transform hover:scale-[1.02]">
      <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">{title}</p>
      <div className="flex justify-between items-end mt-2">
        <span className="text-3xl font-bold">
          {highlight ? (
            <span className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              {value}
            </span>
          ) : (
            <span className="text-emerald-50">{value}</span>
          )}
        </span>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-1">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center justify-between rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)]"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-emerald-50">
            {title}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {desc}
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-[#010806] border border-emerald-500/20 flex items-center justify-center">
        <Plus size={16} className="text-emerald-400" />
      </div>
    </div>
  );
}

function TournamentRow({
  title,
  subtitle,
  status,
  statusColor,
  onClick,
}) {
  const colors = {
    orange:
      "bg-orange-500/10 text-orange-400 border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.15)]",
    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center justify-between rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 hover:border-emerald-500/50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)]"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Trophy size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-50">
            {title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wider border uppercase ${
          colors[statusColor]
        }`}
      >
        {status}
      </span>
    </div>
  );
}