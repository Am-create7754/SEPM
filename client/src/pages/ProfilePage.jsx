import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { User, Edit3, Users, Trophy, Activity, ChevronRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("http://localhost:5001/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010806] flex items-center justify-center">
        <div className="text-emerald-400 font-medium text-lg animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  // 🔥 Yahan logic change kiya: Check if player-specific data exists
  // Agar playerRole 'none' hai, matlab profile complete nahi hai
  const isProfileComplete = profile && profile.playerRole && profile.playerRole !== "none";

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-8 lg:px-24 py-10 overflow-y-auto custom-scrollbar">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-emerald-50">My Profile</h1>
            <p className="text-sm text-slate-400 mt-1">Player information and personal stats</p>
          </div>

          {!isProfileComplete ? (
            <div className="max-w-xl rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] to-[#041511] p-10 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center mb-6">
                <User size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-emerald-50 mb-3">Setup Your Player Profile</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Welcome, <span className="text-emerald-400 font-bold">{profile?.name}</span>! <br/>
                To start tracking your runs, wickets, and appearing in team squads, you need to set your batting and bowling styles.
              </p>
              <Link
                to="/profile/create"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#010806] font-extrabold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
              >
                Complete Profile Now <ChevronRight size={20} />
              </Link>
            </div>
          ) : (
            <div className="max-w-5xl">
              {/* Profile Card */}
              <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.05)] mb-10 gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <User size={48} />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-3xl font-bold text-emerald-50">{profile.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold tracking-widest uppercase">
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2">
                      <span className="capitalize text-emerald-300">{profile.playerRole}</span> 
                      <span className="text-slate-600">|</span> 
                      {profile.batting}-hand bat 
                      <span className="text-slate-600">|</span> 
                      {profile.bowling} bowler
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Member Since</p>
                   <p className="text-sm font-medium text-emerald-100">{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Stats Section */}
              <h2 className="text-lg font-bold text-emerald-50 mb-4 flex items-center gap-2">
                <BarChart3 className="text-emerald-400" size={20} /> Career Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <StatCard label="Matches" value={profile.matchesPlayed || "0"} icon={<Activity size={20} />} />
                <StatCard label="Total Runs" value={profile.totalRuns || "0"} icon={<Trophy size={20} />} />
                <StatCard label="Wickets" value={profile.totalWickets || "0"} icon={<Users size={20} />} />
              </div>

              {/* Actions Section */}
              <h2 className="text-lg font-bold text-emerald-50 mb-4">Account Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  to="/admin/settings"
                  className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] to-[#041511] p-6 flex items-center justify-between hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all group border-l-4 border-l-emerald-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Edit3 size={20} />
                    </div>
                    <div>
                      <p className="text-md font-bold text-emerald-50">Edit Skills</p>
                      <p className="text-xs text-slate-400 mt-1">Change role or batting style</p>
                    </div>
                  </div>
                  <ChevronRight className="text-emerald-500/50 group-hover:text-emerald-400 transition-all" />
                </Link>

                <Link
                  to="/profile/team"
                  className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] to-[#041511] p-6 flex items-center justify-between hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all group border-l-4 border-l-blue-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-md font-bold text-emerald-50">My Teams</p>
                      <p className="text-xs text-slate-400 mt-1">Manage squads you belong to</p>
                    </div>
                  </div>
                  <ChevronRight className="text-blue-500/50 group-hover:text-blue-400 transition-all" />
                </Link>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-8 py-6 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:border-emerald-500/40 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
      </div>
      <p className="text-4xl font-black text-emerald-50">{value}</p>
    </div>
  );
}