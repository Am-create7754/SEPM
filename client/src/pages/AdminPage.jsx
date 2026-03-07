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
import {
  getTournaments,
  getAllMatches,
} from "../utils/storage";

export default function AdminPage() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const allTournaments = getTournaments();
    const allMatches = getAllMatches();

    setTournaments(allTournaments);
    setMatches(allMatches);
  }, []);

  /* =========================
     Derived Stats
  ==========================*/
  const totalTournaments = tournaments.length;

  const totalMatches = matches.length;

  const liveMatches = matches.filter(
    (m) => m.status === "live"
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

        <main className="flex-1 px-20 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
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
          <h2 className="text-lg font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
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
          <h2 className="text-lg font-semibold mb-4">
            Active Tournaments
          </h2>

          <div className="space-y-4">
            {tournaments.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-4 text-slate-400 text-sm">
                No tournaments created yet.
              </div>
            ) : (
              tournaments.map((t) => (
                <TournamentRow
                  key={t.id}
                  title={t.name}
                  subtitle={`${t.matches?.length || 0} matches · ${
                    t.teams?.length || 0
                  } teams`}
                  status={
                    t.matches?.some((m) => m.status === "live")
                      ? "LIVE"
                      : "ACTIVE"
                  }
                  statusColor={
                    t.matches?.some((m) => m.status === "live")
                      ? "orange"
                      : "emerald"
                  }
                  onClick={() =>
                    navigate(`/tournaments/${t.id}`)
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
    <div className="rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 shadow-[0_0_25px_rgba(16,185,129,0.08)]">
      <p className="text-sm text-slate-400">{title}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-2xl font-semibold">
          {highlight ? (
            <span className="text-amber-400">
              {value}
            </span>
          ) : (
            value
          )}
        </span>
        <span className="text-emerald-400">
          {icon}
        </span>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center justify-between rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 hover:bg-emerald-500/5 transition"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">
            {title}
          </p>
          <p className="text-xs text-slate-400">
            {desc}
          </p>
        </div>
      </div>

      <Plus size={16} className="text-slate-400" />
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
      "bg-orange-500/20 text-orange-300 border-orange-500/40",
    emerald:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center justify-between rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 hover:border-emerald-400/40 transition"
    >
      <div className="flex items-center gap-3">
        <Trophy size={18} className="text-emerald-400" />
        <div>
          <p className="text-sm font-medium">
            {title}
          </p>
          <p className="text-xs text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-[11px] border ${
          colors[statusColor]
        }`}
      >
        {status}
      </span>
    </div>
  );
}
