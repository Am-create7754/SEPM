import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { UserPlus } from 'lucide-react';

export default function CreateProfilePage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('batsman');
  const [batting, setBatting] = useState('right');
  const [bowling, setBowling] = useState('pace');
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // CreateProfilePage.jsx ke handleSubmit mein:

const handleSubmit = async (e) => {
  e.preventDefault();
  const profileData = { name, role, batting, bowling };

  try {
    // 🔥 Full URL use kar taaki koi confusion na rahe
    const res = await axios.post("http://localhost:5000/api/admin/profile", profileData, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}` 
      }
    });
    
    if(res.status === 200) {
      alert('Profile created successfully ✅');
      navigate('/profile');
    }
  } catch (error) {
    // 🔥 Console mein error print karo taaki pata chale 401 hai, 404 hai ya 500
    console.error("Frontend Error:", error.response?.data || error.message);
    alert('Failed to create profile: ' + (error.response?.data?.message || "Server Error"));
  }
};

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-8 lg:px-24 py-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <UserPlus size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-50">Create Player Profile</h1>
              <p className="text-sm text-slate-400 mt-1">Set up your stats to track your performance</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-8 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] space-y-6"
          >
            <div>
              <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Player Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-medium"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all font-medium appearance-none"
                >
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="allrounder">All-Rounder</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Batting Style</label>
                <select
                  value={batting}
                  onChange={(e) => setBatting(e.target.value)}
                  className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all font-medium appearance-none"
                >
                  <option value="right">Right Hand</option>
                  <option value="left">Left Hand</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-2">Bowling Type</label>
                <select
                  value={bowling}
                  onChange={(e) => setBowling(e.target.value)}
                  className="w-full px-4 py-3 bg-[#010806] border border-emerald-500/30 text-emerald-50 rounded-xl focus:outline-none focus:border-emerald-400 transition-all font-medium appearance-none"
                >
                  <option value="pace">Pace / Fast</option>
                  <option value="spin">Spin</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#010806] font-extrabold tracking-wide rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] mt-4"
            >
              CREATE PROFILE
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}