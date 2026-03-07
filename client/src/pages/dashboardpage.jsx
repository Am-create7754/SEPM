// src/pages/DashboardPage.jsx
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import Hero from '../components/hero';
import LiveNow from '../components/livenow';

import { Trophy, Activity, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
     <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-6 overflow-y-auto">
          <Hero />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <StatCard
              label="Total Tournaments"
              value="0"
              icon={<Trophy size={16} />}
            />

            <StatCard
              label="Live Matches"
              value="0"
              live
              icon={<Activity size={16} />}
            />

            <StatCard
              label="Total Matches"
              value="0"
              icon={<BarChart3 size={16} />}
            />
          </div>

          {/* Live Now Wrapper */}
          <div
            className="
              mt-6
              max-w-xl
            "
          >
            <LiveNow />
          </div>

        </main>
      </div>
    </div>
  );
}


function StatCard({ label, value, live, icon }) {
  return (
    <div
      className="
        rounded-xl
        bg-gradient-to-br
        from-[#0a2a1f]
        via-[#062019]
        to-[#041511]
        border border-emerald-500/20
        px-5 py-4
        shadow-[0_0_30px_rgba(16,185,129,0.10)]
      "
    >
      <div className="flex justify-between items-center mb-3">
        
        {/* Icon box */}
        <div className="
          w-7 h-7 rounded-lg
          bg-emerald-500/10
          border border-emerald-500/25
          flex items-center justify-center
          text-emerald-400
        ">
          {icon}
        </div>

        {live && (
          <span className="
            text-[10px]
            px-2 py-0.5
            rounded-full
            bg-amber-500/15
            text-amber-400
            border border-amber-500/40
          ">
            LIVE
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-xl font-semibold mt-1 text-emerald-300">
        {value}
      </p>
    </div>
  );
}

