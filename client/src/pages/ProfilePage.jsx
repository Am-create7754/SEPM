// src/pages/ProfilePage.jsx
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { User, Edit3, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const profile = JSON.parse(localStorage.getItem('playerProfile'));

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">
          <h1 className="text-xl font-semibold mb-1">My Profile</h1>
          <p className="text-xs text-slate-400 mb-6">
            Player information and quick actions
          </p>

          {/* If no profile */}
          {!profile ? (
            <div className="max-w-lg rounded-xl border border-emerald-500/20 bg-black/40 p-6">
              <p className="text-slate-400 mb-4">
                You haven't created your player profile yet.
              </p>
              <Link
                to="/create-profile"
                className="inline-block px-4 py-2 rounded-md bg-emerald-500/20 border border-emerald-500 text-emerald-300 hover:bg-emerald-500/30 transition"
              >
                Create Profile
              </Link>
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <User size={26} />
                  </div>

                  <div>
                    <p className="text-lg font-semibold">{profile.name}</p>
                    <p className="text-xs text-slate-400 capitalize">
                      {profile.role} · {profile.batting}-hand bat · {profile.bowling}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  PLAYER
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StatCard label="Matches Played" value="0" icon={<Trophy size={14} />} />
                <StatCard label="Runs Scored" value="00" icon={<User size={14} />} />
                <StatCard label="Wickets Taken" value="0" icon={<Trophy size={14} />} />
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/profile/create"
                  className="rounded-xl border border-emerald-500/20 bg-black/40 p-4 flex items-center justify-between hover:bg-emerald-500/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Edit3 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Edit Profile</p>
                      <p className="text-[11px] text-slate-400">
                        Update your player details
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-500">→</span>
                </Link>

                <Link
                  to="/profile/team"
                  className="rounded-xl border border-emerald-500/20 bg-black/40 p-4 flex items-center justify-between hover:bg-emerald-500/10 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">My Team</p>
                      <p className="text-[11px] text-slate-400">
                        View or manage your team
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-500">→</span>
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <p className="text-[11px] text-slate-400">{label}</p>
      </div>
      <p className="text-xl font-semibold text-emerald-300">{value}</p>
    </div>
  );
}
