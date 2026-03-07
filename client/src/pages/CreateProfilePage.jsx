// src/pages/CreateProfilePage.jsx
import { useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

export default function CreateProfilePage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('batsman');
  const [batting, setBatting] = useState('right');
  const [bowling, setBowling] = useState('pace');

  const handleSubmit = (e) => {
    e.preventDefault();

    const profile = {
      name,
      role,
      batting,
      bowling,
    };

    localStorage.setItem('playerProfile', JSON.stringify(profile));
    alert('Profile created successfully ✅');
  };

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 px-24 py-8">
          <h1 className="text-xl font-semibold mb-4">Create Player Profile</h1>

          <form
            onSubmit={handleSubmit}
            className="max-w-lg space-y-4 bg-black/40 p-6 rounded-xl border border-emerald-500/20"
          >
            <div>
              <label className="text-xs text-slate-400">Player Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md bg-black border border-slate-700 text-sm"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md bg-black border border-slate-700 text-sm"
              >
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="allrounder">All-Rounder</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">Batting</label>
              <select
                value={batting}
                onChange={(e) => setBatting(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md bg-black border border-slate-700 text-sm"
              >
                <option value="right">Right Hand</option>
                <option value="left">Left Hand</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400">Bowling Type</label>
              <select
                value={bowling}
                onChange={(e) => setBowling(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-md bg-black border border-slate-700 text-sm"
              >
                <option value="pace">Pace</option>
                <option value="spin">Spin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-2 rounded-md bg-emerald-500/20 border border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 transition"
            >
              Create Profile
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
