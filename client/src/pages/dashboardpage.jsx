import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import Hero from '../components/hero';

import { Trophy, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  /* =========================
     FETCH DB DATA
  ========================= */
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const [tournRes, matchRes] = await Promise.all([
          fetch("http://localhost:5000/api/tournaments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/matches", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const tournData = await tournRes.json();
        const matchData = await matchRes.json();

        setTournaments(Array.isArray(tournData) ? tournData : []);
        setMatches(Array.isArray(matchData) ? matchData : []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }
    
    fetchDashboardData();
  }, []);

  const totalTournaments = tournaments.length;
  const totalMatches = matches.length;
  
  // Calculate Completed Matches instead of Live
  const completedMatchesCount = matches.filter(
    (m) => m.status?.toLowerCase() === "completed"
  ).length;

  // Get Latest 2 Completed Matches
  const recentCompletedMatches = matches
    .filter((m) => m.status?.toLowerCase() === "completed")
    .slice(0, 2);

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-8 lg:px-24 py-6 overflow-y-auto custom-scrollbar">
          <Hero />

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <StatCard
              label="Total Tournaments"
              value={totalTournaments}
              icon={<Trophy size={16} />}
            />

            <StatCard
              label="Completed Matches"
              value={completedMatchesCount}
              completed
              icon={<CheckCircle2 size={16} />}
            />

            <StatCard
              label="Total Matches"
              value={totalMatches}
              icon={<BarChart3 size={16} />}
            />
          </div>

          {/* Completed Matches Preview Section */}
          <div className="mt-10 max-w-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-emerald-50">Recent Completed Matches</h2>
              <button 
                onClick={() => navigate('/matches')} 
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20"
              >
                See All Matches <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid gap-4">
              {recentCompletedMatches.length === 0 ? (
                <div className="text-sm text-slate-400 bg-gradient-to-br from-[#0a2a1f] to-[#041511] p-6 rounded-xl border border-emerald-500/20 text-center">
                  No completed matches yet.
                </div>
              ) : (
                recentCompletedMatches.map((m) => (
                  <MiniMatchCard key={m._id} match={m} />
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

/* =======================
   Stat Card Component
======================= */
function StatCard({ label, value, completed, icon }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 px-5 py-4 shadow-[0_0_30px_rgba(16,185,129,0.05)] transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-center mb-3">
        {/* Icon box */}
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
          {icon}
        </div>

        {completed && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 tracking-wider uppercase">
            Done
          </span>
        )}
      </div>

      <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase mb-1">{label}</p>
      <p className="text-2xl font-bold text-emerald-50">
        {value}
      </p>
    </div>
  );
}

/* =======================
   Mini Match Card Component
======================= */
function MiniMatchCard({ match }) {
  const teamAName = match.teamA?.name || "Team A";
  const teamBName = match.teamB?.name || "Team B";
  const inning1 = match.score?.inning1;
  const inning2 = match.score?.inning2;
  
  const winnerName = match.winner?.name || (match.winner === match.teamA?._id ? teamAName : teamBName);

  return (
    <div className="bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] border border-emerald-500/20 rounded-xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.05)] flex justify-between items-center hover:border-emerald-500/40 transition-colors">
      
      <div className="flex-1 space-y-3">
        {/* Team A */}
        <div className="flex justify-between items-center pr-6">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-black/40 border border-slate-700 text-[9px] font-bold flex items-center justify-center text-slate-300">
               {teamAName.slice(0,3).toUpperCase()}
             </div>
             <span className="text-sm font-medium text-emerald-50">{teamAName}</span>
          </div>
          {inning1 && inning1.runs !== undefined && (
            <span className="text-sm font-bold text-emerald-100">{inning1.runs}/{inning1.wickets} <span className="text-[10px] text-slate-400 font-normal">({inning1.overs})</span></span>
          )}
        </div>

        {/* Team B */}
        <div className="flex justify-between items-center pr-6">
           <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-black/40 border border-slate-700 text-[9px] font-bold flex items-center justify-center text-slate-300">
               {teamBName.slice(0,3).toUpperCase()}
             </div>
             <span className="text-sm font-medium text-emerald-50">{teamBName}</span>
          </div>
          {inning2 && inning2.runs !== undefined && (
            <span className="text-sm font-bold text-emerald-100">{inning2.runs}/{inning2.wickets} <span className="text-[10px] text-slate-400 font-normal">({inning2.overs})</span></span>
          )}
        </div>
      </div>

      {/* Winner Badge */}
      {match.winner && (
        <div className="pl-6 border-l border-emerald-500/20 text-center min-w-[100px]">
          <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-widest mb-1">Winner</p>
          <p className="text-xs font-bold text-emerald-400 truncate max-w-[100px]">{winnerName}</p>
        </div>
      )}
    </div>
  );
}