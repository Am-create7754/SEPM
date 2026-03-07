import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { Trash2, Users, Plus, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyTeamPage() {
  const [team, setTeam] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('Batsman');

  useEffect(() => {
    const savedTeam = localStorage.getItem('myTeam');
    if (savedTeam) {
      setTeam(JSON.parse(savedTeam));
    }
  }, []);

  function handleRemoveTeam() {
    const confirm = window.confirm('Are you sure you want to remove this team?');
    if (!confirm) return;

    localStorage.removeItem('myTeam');
    setTeam(null);
  }

  function handleAddPlayer() {
    if (!playerName.trim()) return;

    const updatedTeam = {
      ...team,
      members: [...team.members, { name: playerName, role: playerRole }],
    };

    setTeam(updatedTeam);
    localStorage.setItem('myTeam', JSON.stringify(updatedTeam));
    setPlayerName('');
    setPlayerRole('Batsman');
  }

  function handleRemovePlayer(index) {
    const updatedMembers = team.members.filter((_, i) => i !== index);
    const updatedTeam = { ...team, members: updatedMembers };

    setTeam(updatedTeam);
    localStorage.setItem('myTeam', JSON.stringify(updatedTeam));
  }

  function handleChangeRole(index, newRole) {
    const updatedMembers = team.members.map((m, i) =>
      i === index ? { ...m, role: newRole } : m
    );

    const updatedTeam = { ...team, members: updatedMembers };

    setTeam(updatedTeam);
    localStorage.setItem('myTeam', JSON.stringify(updatedTeam));
  }

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">
          <h1 className="text-xl font-semibold mb-1">My Team</h1>
          <p className="text-xs text-slate-400 mb-6">
            Manage your team and players
          </p>

          {!team ? (
            <div className="max-w-xl rounded-xl border border-emerald-500/20 bg-black/40 p-6">
              <p className="text-slate-400 mb-5">
                You are not part of any team yet.
              </p>

              <div className="flex gap-3">
                <Link
                  to="/join-team"
                  className="px-4 py-2 rounded-md bg-emerald-500/20 border border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 transition flex items-center gap-2"
                >
                  <LogIn size={14} />
                  Join Team
                </Link>

                <Link
                  to="/create-team"
                  className="px-4 py-2 rounded-md bg-black/40 border border-emerald-500/30 text-slate-200 hover:bg-emerald-500/10 transition flex items-center gap-2"
                >
                  <Plus size={14} />
                  Create Team
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Users size={16} />
                  <h2 className="font-semibold">{team.name}</h2>
                </div>

                <button
                  onClick={handleRemoveTeam}
                  className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300"
                >
                  <Trash2 size={14} />
                  Remove Team
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Members ({team.members.length}/{team.maxPlayers})
              </p>

              {/* Members List */}
              <div className="space-y-2 mb-4">
                {team.members.map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-base bg-black/30 border border-emerald-500/10 rounded-md px-3 py-2"
                  >
                    <div>
                      <p className="text-slate-200">{m.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase">
                        Player
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit Role */}
                      <select
                        value={m.role}
                        onChange={(e) =>
                          handleChangeRole(i, e.target.value)
                        }
                        className="bg-black/40 border border-emerald-500/30 text-sm rounded px-2 py-1 focus:outline-none"
                      >
                        <option className='bg-black'>Batsman</option>
                        <option className='bg-black'>Bowler</option>
                        <option className='bg-black'>All-Rounder</option>
                        <option className='bg-black'>Wicket-Keeper</option>
                        <option className='bg-black'>Player</option>
                      </select>

                      {/* Remove Player */}
                      <button
                        onClick={() => handleRemovePlayer(i)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Player */}
              {team.members.length < team.maxPlayers ? (
                <div className="flex gap-2 mt-3">
                  <input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="flex-1 px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm outline-none"
                  />

                  <select
                    value={playerRole}
                    onChange={(e) => setPlayerRole(e.target.value)}
                    className="px-2 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
                  >
                    <option className='bg-black'>Batsman</option>
                    <option className='bg-black'>Bowler</option>
                    <option className='bg-black'>All-Rounder</option>
                    <option className='bg-black'>Wicket-Keeper</option>
                    <option className='bg-black'>Player</option>
                  </select>

                  <button
                    onClick={handleAddPlayer}
                    className="px-3 py-2 rounded-md bg-emerald-500 text-emerald-950 hover:bg-emerald-400 flex items-center gap-1"
                  >
                    <UserPlus size={14} />
                    Add
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Team is full</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
