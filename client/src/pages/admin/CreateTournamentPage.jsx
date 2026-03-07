import { useEffect, useState } from "react";
import { getTeams, getTournaments, saveTournaments } from "../../utils/storage";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Trophy, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function CreateTournamentPage() {
  const [name, setName] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    setTeams(getTeams());
  }, []);

  function toggleTeam(teamName) {
    setSelectedTeams(prev =>
      prev.includes(teamName)
        ? prev.filter(t => t !== teamName)
        : [...prev, teamName]
    );
  }

  function handleCreate() {
    if (!name || selectedTeams.length < 1) {
      alert("Tournament name + at least 1 teams required");
      return;
    }

    const tournaments = getTournaments();

    const newTournament = {
      id: Date.now(),
      name,
      teams: selectedTeams,
      matches: [],
      pointsTable: selectedTeams.map(t => ({
        team: t,
        played: 0,
        won: 0,
        lost: 0,
        points: 0,
      })),
    };

    saveTournaments([...tournaments, newTournament]);

    setName("");
    setSelectedTeams([]);
    alert("Tournament Created ✅");

    navigate("/tournaments");
  }

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={20} className="text-emerald-400" />
            <div>
              <h1 className="text-xl font-semibold">
                Create Tournament
              </h1>
              <p className="text-xs text-slate-400">
                Setup a new tournament and select participating teams
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="max-w-2xl rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-6">

            {/* Tournament Name */}
            <div className="mb-6">
              <label className="text-xs text-slate-400 block mb-2">
                Tournament Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter tournament name"
                className="w-full px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            {/* Team Selection */}
            <div>
              <label className="text-xs text-slate-400 block mb-3">
                Select Teams
              </label>

              {teams.length === 0 ? (
                <p className="text-red-400 text-sm">
                  No teams created yet
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team, i) => (
                    <div
                      key={i}
                      onClick={() => toggleTeam(team.name)}
                      className={`cursor-pointer px-3 py-2 rounded-md border text-sm transition
                        ${
                          selectedTeams.includes(team.name)
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                            : "bg-black/30 border-emerald-500/10 hover:border-emerald-400/40"
                        }
                      `}
                    >
                      {team.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-emerald-950 text-sm font-medium hover:bg-emerald-400 transition"
              >
                <Plus size={16} />
                Create Tournament
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
