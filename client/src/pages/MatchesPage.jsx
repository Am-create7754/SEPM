import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { Filter, MapPin } from "lucide-react";
import { getAllMatches } from "../utils/storage";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setMatches(getAllMatches() || []);
  }, []);

  const filteredMatches =
    activeFilter === "all"
      ? matches
      : matches.filter(
          (m) => m.status?.toLowerCase() === activeFilter
        );

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "live":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  }

  function shouldShowScore(status) {
    return status === "live" || status === "completed";
  }

  return (
    <div className="h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-20 py-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Matches</h1>
            <p className="text-sm text-slate-400 mt-1">
              View all scheduled, live, completed and cancelled matches
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-8">
            <Filter size={14} className="text-emerald-400" />

            {["all", "live", "upcoming", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm border transition capitalize
                  ${
                    activeFilter === f
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-black/40 text-slate-300 border-slate-700 hover:border-emerald-500/40"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Match List */}
          {filteredMatches.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 text-slate-400 text-sm">
              No matches found.
            </div>
          ) : (
            filteredMatches.map((m) => {
              const showScore = shouldShowScore(m.status);

              return (
                <MatchCard
                  key={m.id}
                  status={m.status?.toUpperCase()}
                  statusColor={getStatusColor(m.status)}
                  teams={[
                    {
                      code: m.teamA?.slice(0, 3).toUpperCase(),
                      name: m.teamA,
                      score:
                        showScore && m.score?.teamA
                          ? `${m.score.teamA.runs}/${m.score.teamA.wickets} (${m.score.teamA.overs})`
                          : null,
                    },
                    {
                      code: m.teamB?.slice(0, 3).toUpperCase(),
                      name: m.teamB,
                      score:
                        showScore && m.score?.teamB
                          ? `${m.score.teamB.runs}/${m.score.teamB.wickets} (${m.score.teamB.overs})`
                          : null,
                    },
                  ]}
                  venue={m.tournamentName}
                  time={
                    m.date
                      ? new Date(m.date).toLocaleString()
                      : null
                  }
                />
              );
            })
          )}
        </main>
      </div>
    </div>
  );
}

/* =======================
   Match Card Component
======================= */

function MatchCard({ status, statusColor, teams, venue, time }) {
  return (
    <div
      className="
        mb-5
        rounded-xl
        bg-gradient-to-br
        from-[#0a2a1f]
        via-[#062019]
        to-[#041511]
        border border-emerald-500/20
        px-5 py-4
        shadow-[0_0_30px_rgba(16,185,129,0.10)]
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`px-3 py-1 rounded-full text-[11px] border ${statusColor}`}
        >
          {status}
        </span>

        {time && (
          <span className="text-[11px] text-slate-400">
            {time}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-3">
        {teams.map((t) => (
          <div key={t.code} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-black/40 border border-slate-700 text-xs flex items-center justify-center">
                {t.code}
              </div>
              <p className="text-sm">{t.name}</p>
            </div>

            {t.score && (
              <p className="text-sm font-semibold text-slate-100">
                {t.score}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <MapPin size={12} />
        {venue}
      </div>
    </div>
  );
}
