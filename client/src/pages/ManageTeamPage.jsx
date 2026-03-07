import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getTeams, saveTeams } from "../utils/storage";
import { Trash2, UserPlus, ArrowLeft } from "lucide-react";

export default function ManageTeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerRole, setPlayerRole] = useState("Batsman");

  useEffect(() => {
    const teams = getTeams();
    const selected = teams.find(t => String(t.id) === id);
    setTeam(selected);
  }, [id]);

  function updateTeam(updatedTeam) {
    const teams = getTeams();
    const updatedTeams = teams.map(t =>
      t.id === updatedTeam.id ? updatedTeam : t
    );
    saveTeams(updatedTeams);
    setTeam(updatedTeam);
  }

  function addPlayer() {
    if (!playerName.trim()) return;

    if (team.members.length >= team.maxPlayers) {
      alert("Team is full");
      return;
    }

    const updatedTeam = {
      ...team,
      members: [...team.members, { name: playerName, role: playerRole }],
    };

    updateTeam(updatedTeam);
    setPlayerName("");
  }

  function removePlayer(index) {
    const updatedMembers = team.members.filter((_, i) => i !== index);
    updateTeam({ ...team, members: updatedMembers });
  }

  function changeRole(index, newRole) {
    const updatedMembers = team.members.map((m, i) =>
      i === index ? { ...m, role: newRole } : m
    );
    updateTeam({ ...team, members: updatedMembers });
  }

  function deleteTeam() {
    const confirmDelete = window.confirm("Delete this team?");
    if (!confirmDelete) return;

    const teams = getTeams().filter(t => t.id !== team.id);
    saveTeams(teams);
    navigate("/create-team");
  }

  if (!team) return null;

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">

          <div className="flex items-center gap-3 mb-6">

  {/* Back Button */}
  <button
    onClick={() => navigate("/create-team")}
    className="p-2 rounded-md border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-500/10 transition"
  >
    <ArrowLeft size={16} />
  </button>

  <div>
    <h1 className="text-xl font-semibold">{team.name}</h1>
    <p className="text-xs text-slate-400">
      Manage players ({team.members.length}/{team.maxPlayers})
    </p>
  </div>

</div>


          {/* Players List */}
          <div className="max-w-xl space-y-3 mb-6">
            {team.members.map((player, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-black/40 border border-emerald-500/20 rounded-md px-4 py-2"
              >
                <div>
                  <p className="text-emerald-300">{player.name}</p>
                  <p className="text-xs text-slate-400">{player.role}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <select
                    value={player.role}
                    onChange={(e) =>
                      changeRole(index, e.target.value)
                    }
                    className="bg-black border border-emerald-500/30 text-sm px-2 py-1 rounded"
                  >
                    <option>Batsman</option>
                    <option>Bowler</option>
                    <option>All-Rounder</option>
                    <option>Wicket-Keeper</option>
                  </select>

                  <button
                    onClick={() => removePlayer(index)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Player */}
          {team.members.length < team.maxPlayers ? (
            <div className="flex gap-2 max-w-xl">
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name"
                className="flex-1 px-3 py-2 bg-black border border-emerald-500/20 rounded-md text-sm"
              />

              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="px-2 py-2 bg-black border border-emerald-500/20 rounded-md text-base"
              >
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-Rounder</option>
                <option>Wicket-Keeper</option>
              </select>

              <button
                onClick={addPlayer}
                className="px-3 py-2 bg-emerald-500 text-black rounded-md flex items-center gap-1"
              >
                <UserPlus size={14} />
                Add
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Team is full</p>
          )}

          {/* Delete Team */}
          <div className="mt-8">
            <button
              onClick={deleteTeam}
              className="text-red-400 text-xs hover:text-red-300"
            >
              Delete Team
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
