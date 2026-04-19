import { useEffect, useState } from "react";
import axios from "axios"; // 🔥 Axios import kiya
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { Filter, MapPin, Trash2, XCircle, TrendingUp } from "lucide-react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function fetchAllMatches() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/matches", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setMatches(data || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }
    fetchAllMatches();
  }, []);

  async function deleteMatch(id) {
    if (!window.confirm("Bhai sach me delete karna hai ye match?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/matches/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function cancelMatch(id) {
    if (!window.confirm("Is match ko cancel karna hai?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/matches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "cancelled" }),
      });
      setMatches((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: "cancelled" } : m))
      );
    } catch (err) {
      console.error(err);
    }
  }

  // 🔥 Profile Update Function
  async function updateMyProfileStats(runs, wickets) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("User id nahi mili localStorage me!");

      await axios.put("http://localhost:5000/api/auth/update-stats", {
        playerId: user._id,
        runs: runs,
        wickets: wickets
      });
      alert(`Profile Updated: +${runs} Runs, +${wickets} Wickets ✅`);
    } catch (err) {
      console.error("Error updating stats", err);
      alert("Backend route update-stats check kar");
    }
  }

  const filteredMatches =
    activeFilter === "all"
      ? matches
      : matches.filter((m) => m.status?.toLowerCase() === activeFilter);

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/40";
      default: return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  }

  return (
    <div className="h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 px-20 py-8 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Matches</h1>
            <p className="text-sm text-slate-400 mt-1">View all scheduled matches</p>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Filter size={14} className="text-emerald-400" />
            {["all", "upcoming", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm border transition capitalize ${activeFilter === f ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-black/40 text-slate-300 border-slate-700 hover:border-emerald-500/40"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredMatches.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 text-slate-400 text-sm">No matches found.</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {filteredMatches.map((matchData) => (
                <MatchCard
                  key={matchData._id}
                  m={matchData}
                  statusColor={getStatusColor(matchData.status || "upcoming")}
                  onDelete={() => deleteMatch(matchData._id)}
                  onCancel={() => cancelMatch(matchData._id)}
                  onUpdateStats={updateMyProfileStats} // 🔥 Function pass kiya
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* =======================
   Match Card Component
======================= */
/* =======================
   Match Card Component
======================= */
function MatchCard({ m, statusColor, onDelete, onCancel, onUpdateStats }) {
  const showScore = m.status?.toLowerCase() === "live" || m.status?.toLowerCase() === "completed";
  const teamAName = m.teamA?.name || "Team A";
  const teamBName = m.teamB?.name || "Team B";

  const inning1 = m.score?.inning1;
  const inning2 = m.score?.inning2;

  const winnerId = m.winner?._id?.toString() || m.winner?.toString();
  const teamAId = m.teamA?._id?.toString() || m.teamA?.toString();

  const winnerName = winnerId === teamAId ? teamAName : teamBName;

  const canCancel = m.status?.toLowerCase() !== "completed" && m.status?.toLowerCase() !== "cancelled";
  const hasInning2Started = inning2 && (inning2.runs > 0 || inning2.overs > 0 || m.status?.toLowerCase() === "completed");

  // 🔥 Naya function: Ab ye tujhse runs aur wickets poochega
  const handleSyncClick = () => {
    const userRuns = window.prompt("Is match mein aapne kitne RUNS banaye?", "0");
    if (userRuns === null) return; // Agar cancel daba diya toh ruk jao

    const userWickets = window.prompt("Is match mein aapne kitne WICKETS liye?", "0");
    if (userWickets === null) return;

    // Jo number tune daala, wo backend ko bhej dega
    onUpdateStats(Number(userRuns), Number(userWickets));
  };

  return (
    <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.10)]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-[11px] border ${statusColor}`}>
            {m.status?.toUpperCase() || "UPCOMING"}
          </span>
          {m.date && <span className="text-[11px] text-slate-400">{new Date(m.date).toLocaleString()}</span>}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-slate-700 text-[10px] font-bold flex items-center justify-center">
                {teamAName.slice(0, 3).toUpperCase()}
              </div>
              <p className="text-sm font-medium">{teamAName}</p>
            </div>
            {showScore && inning1 && inning1.runs !== undefined && (
              <p className="text-sm font-bold text-slate-100">
                {inning1.runs}/{inning1.wickets} <span className="text-[11px] text-slate-400 font-normal">({inning1.overs} ov)</span>
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-slate-700 text-[10px] font-bold flex items-center justify-center">
                {teamBName.slice(0, 3).toUpperCase()}
              </div>
              <p className="text-sm font-medium">{teamBName}</p>
            </div>
            {showScore && hasInning2Started && (
              <p className="text-sm font-bold text-slate-100">
                {inning2.runs}/{inning2.wickets} <span className="text-[11px] text-slate-400 font-normal">({inning2.overs} ov)</span>
              </p>
            )}
          </div>
        </div>

        {m.status?.toLowerCase() === "completed" && winnerId && (
          <div className="mt-4 py-1.5 px-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-center">
            <p className="text-[10px] font-bold text-emerald-400">🏆 WINNER: {m.winner?.name || winnerName}</p>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center">
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <MapPin size={12} className="text-emerald-500/70" /> {m.setup?.ground || "TBD"}
        </div>

        <div className="flex items-center gap-3">
          {/* 🔥 Button Update Kar Diya */}
          {m.status?.toLowerCase() === "completed" && (
            <button
              onClick={handleSyncClick}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              <TrendingUp size={14} /> Sync Stats
            </button>
          )}

          {canCancel && (
            <button onClick={onCancel} className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 transition-colors">
              <XCircle size={14} /> Cancel
            </button>
          )}
          <button onClick={onDelete} className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-400 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}