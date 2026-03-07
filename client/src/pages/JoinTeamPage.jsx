// src/pages/JoinTeamPage.jsx
import { useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { Users, LogIn, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function JoinTeamPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleJoin() {
    setError('');

    if (!code.trim()) {
      setError('Please enter a team code');
      return;
    }

    // 🔹 Demo: Fake team codes (later API se replace kar dena)
    const demoTeams = {
      SEPM2025: {
        name: 'SEPM Premier League 2025',
        maxPlayers: 6,
        members: [
          { name: 'Rahul', role: 'Captain' },
          { name: 'Aman', role: 'Batsman' },
        ],
      },
      WINTER24: {
        name: 'Winter Championship 2024',
        maxPlayers: 5,
        members: [{ name: 'Karan', role: 'Bowler' }],
      },
    };

    const team = demoTeams[code.toUpperCase()];

    if (!team) {
      setError('Invalid team code. Try SEPM2025 or WINTER24');
      return;
    }

    if (team.members.length >= team.maxPlayers) {
      setError('Team is already full');
      return;
    }

    // 🔹 Add current user (demo user)
    const updatedTeam = {
      ...team,
      members: [...team.members, { name: 'You', role: 'Player' }],
    };

    localStorage.setItem('myTeam', JSON.stringify(updatedTeam));
    navigate('/profile/team');
  }

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 mb-6"
          >
            <ArrowLeft size={12} />
            Back
          </button>

          <div
            className="
              max-w-xl
              rounded-xl
              bg-gradient-to-br
              from-[#0a2a1f]
              via-[#062019]
              to-[#041511]
              border border-emerald-500/20
              p-6
              shadow-[0_0_30px_rgba(16,185,129,0.10)]
            "
          >
            <div className="flex items-center gap-2 mb-4 text-emerald-300">
              <Users size={18} />
              <h1 className="text-lg font-semibold">Join a Team</h1>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Enter the team code shared by your captain to join the team.
            </p>

            <div className="space-y-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Team Code (e.g. SEPM2025)"
                className="
                  w-full
                  px-4 py-2
                  rounded-lg
                  bg-black/40
                  border border-emerald-500/20
                  outline-none
                  text-sm
                  text-slate-200
                  focus:border-emerald-400
                "
              />

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              <button
                onClick={handleJoin}
                className="
                  w-full
                  mt-2
                  px-4 py-2
                  rounded-lg
                  bg-emerald-500
                  text-emerald-950
                  text-sm
                  font-medium
                  hover:bg-emerald-400
                  transition
                  flex items-center justify-center gap-2
                "
              >
                <LogIn size={14} />
                Join Team
              </button>
            </div>

            <div className="mt-5 text-[11px] text-slate-500">
              Demo Codes: <span className="text-emerald-400">SEPM2025</span>,{' '}
              <span className="text-emerald-400">WINTER24</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
