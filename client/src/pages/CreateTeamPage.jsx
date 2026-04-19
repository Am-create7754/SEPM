import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function CreateTeamPage() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(11);
  const [includeMyself, setIncludeMyself] = useState(false);

  const navigate = useNavigate();

  /* =========================
     FETCH TEAMS FROM BACKEND
  ========================= */
  async function fetchTeams() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teams", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  /* =========================
     CREATE TEAM
  ========================= */
  async function handleCreateTeam(e) {
    e.preventDefault();

    if (!teamName.trim()) {
      alert('Team name required');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: teamName,
          maxPlayers: Number(maxPlayers)
        })
      });
      const newTeam = await res.json();

      if (includeMyself) {
        const token = localStorage.getItem("token");
        try {
          const userRes = await fetch("http://localhost:5000/api/admin/profile", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.name && userData.playerRole) {
              await fetch(`http://localhost:5000/api/teams/${newTeam._id}/add-player`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: userData.name, role: userData.playerRole })
              });
            }
          }
        } catch (err) {
          console.error("Failed to add self to team", err);
        }
      }

      fetchTeams(); // refresh list

      setTeamName('');
      setMaxPlayers(11);
      setIncludeMyself(false);

    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     DELETE TEAM
  ========================= */
  async function handleDeleteTeam(id) {
    const confirmDelete = window.confirm("Delete this team?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/teams/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      fetchTeams();

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">

          <h1 className="text-xl font-semibold mb-1">Create Teams</h1>
          <p className="text-xs text-slate-400 mb-6">
            Create at least 2 teams to start tournaments
          </p>

          {/* Create Form */}
          <form
            onSubmit={handleCreateTeam}
            className="max-w-xl rounded-xl bg-black border border-slate-700 p-6 space-y-4 mb-8"
          >
            <div>
              <label className="text-xs text-slate-400">Team Name</label>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Royal Challengers"
                className="mt-1 w-full bg-black border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Max Players</label>
              <input
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                min={2}
                max={15}
                className="mt-1 w-full bg-black border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="includeMyself"
                checked={includeMyself}
                onChange={(e) => setIncludeMyself(e.target.checked)}
                className="rounded border-slate-700 bg-black text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="includeMyself" className="text-xs text-slate-400">
                Include me as a player in this team
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-2 rounded-md bg-emerald-500/20 border border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} />
              Add Team
            </button>
          </form>

          {/* Teams List */}
          <div className="max-w-xl space-y-3">
            {teams.map(team => (
              <div
                key={team._id}
                onClick={() => navigate(`/manage-team/${team._id}`)}
                className="cursor-pointer flex justify-between items-center rounded-lg border border-emerald-500/20 bg-black/40 px-4 py-3 hover:border-emerald-400 transition"
              >
                <div>
                  <p className="text-sm font-medium text-emerald-300">
                    {team.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Players: {team.members.length}/{team.maxPlayers}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTeam(team._id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {teams.length < 2 && (
              <p className="text-xs text-red-400">
                ⚠️ Minimum 2 teams required to create a tournament
              </p>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}