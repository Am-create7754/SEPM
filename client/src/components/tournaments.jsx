// src/Tournaments.jsx
import { CalendarDays, Trophy } from 'lucide-react';

const data = [
  {
    name: 'SEPM Premier League 2025',
    date: '2025-01-05',
    teams: '4 Teams',
    type: 'League',
    status: 'LIVE',
    color: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  },
  {
    name: 'Tech Cup Knockout 2025',
    date: '2025-02-01',
    teams: '8 Teams',
    type: 'Knockout',
    status: 'PLANNING',
    color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
  },
  {
    name: 'Winter Championship 2024',
    date: '2024-12-01',
    teams: '12 Teams',
    type: 'League',
    status: 'COMPLETED',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  },
];

export default function Tournaments() {
  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-slate-200">
          Tournaments
        </p>
        <button className="text-[11px] text-slate-400 hover:text-slate-200">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {data.map((t) => (
          <div
            key={t.name}
            className="
              rounded-xl
              bg-gradient-to-r
              from-[#0a2a1f]
              via-[#062019]
              to-[#041511]
              border border-emerald-500/15
              px-5 py-3
              flex justify-between items-center
              transition-all duration-300
              hover:translate-y-[-2px]
              hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]
            "
          >
            <div className="flex items-center gap-3">
              
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-black/40 border border-slate-700 flex items-center justify-center text-emerald-400">
                <Trophy size={18} />
              </div>

              {/* Tournament Info */}
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {t.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <CalendarDays size={12} />
                  {t.date} · {t.teams} · {t.type}
                </p>
              </div>
            </div>

            {/* Status */}
            <span
              className={`px-3 py-1 text-[11px] rounded-full border ${t.color}`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
