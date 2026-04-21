import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Trophy, Plus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateTournamentPage() {
  const [name, setName] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const navigate = useNavigate();

  /* =========================
     FETCH TEAMS FROM DB
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5001/api/teams", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeams(data);
        } else {
          setTeams([]);
        }
      })
      .catch(err => {
        console.error("Error fetching teams:", err);
        setTeams([]);
      });
  }, []);

  function toggleTeam(teamId) {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(t => t !== teamId)
        : [...prev, teamId]
    );
  }

  /* =========================
     CREATE TOURNAMENT (DB)
  ========================= */
  async function handleCreate() {
    if (!name || selectedTeams.length < 1) {
      alert("Tournament name + at least 1 team required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5001/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          teams: selectedTeams // 🔥 store IDs
        })
      });

      alert("Tournament Created ✅");
      navigate("/tournaments"); // Update the path according to your routing

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-8 lg:px-24 py-8 overflow-y-auto">

          {/* PAGE HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Trophy size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-50">Create Tournament</h1>
              <p className="text-sm text-slate-400 mt-0.5">Setup a new tournament and select participating teams</p>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="max-w-2xl rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)]">

            {/* TOURNAMENT NAME INPUT */}
            <div className="mb-8">
              <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-3">
                Tournament Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. IPL 2026, World Cup..."
                className="w-full px-4 py-3.5 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 placeholder-slate-600 transition-all font-medium"
              />
            </div>

            {/* TEAM SELECTION */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest">
                  Select Participating Teams
                </label>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                  {selectedTeams.length} Selected
                </span>
              </div>
              
              {teams.length === 0 ? (
                <p className="text-sm text-slate-500 bg-[#010806] p-4 rounded-xl border border-slate-800">No teams available. Please create teams first.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {teams.map(team => {
                    const isSelected = selectedTeams.includes(team._id);
                    return (
                      <div
                        key={team._id}
                        onClick={() => toggleTeam(team._id)}
                        className={`cursor-pointer px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-between gap-2
                          ${isSelected
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            : "bg-[#062019] border-emerald-500/20 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/10"}
                        `}
                      >
                        <span className="truncate">{team.name}</span>
                        {isSelected && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CREATE BUTTON */}
            <button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 py-2 px-1 bg-emerald-500 hover:bg-emerald-400 text-[#010806] font-bold tracking-wide text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-[0.98]"
            >
              <Plus size={20} /> CREATE TOURNAMENT
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}