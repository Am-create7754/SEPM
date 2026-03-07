// src/pages/CreateTeamPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { PlusCircle, Trash2 } from 'lucide-react';
import { getTeams, saveTeams } from '../utils/storage';

export default function CreateTeamPage() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(11);

  useEffect(() => {
    setTeams(getTeams());
  }, []);

  function handleCreateTeam(e) {
    e.preventDefault();

    if (!teamName.trim()) {
      alert('Team name required');
      return;
    }

    const newTeam = {
      id: Date.now(),
      name: teamName,
      members: [{ name: 'You', role: 'Captain' }],
      maxPlayers: Number(maxPlayers),
    };

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    saveTeams(updatedTeams);

    setTeamName('');
    setMaxPlayers(11);
  }

  function handleDeleteTeam(id) {
    const confirmDelete = window.confirm("Delete this team?");
    if (!confirmDelete) return;

    const updated = teams.filter(team => team.id !== id);
    setTeams(updated);
    saveTeams(updated);
  }
  const navigate = useNavigate();


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
               key={team.id}
      onClick={() => navigate(`/manage-team/${team.id}`)}
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
                  onClick={() => handleDeleteTeam(team.id)}
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
