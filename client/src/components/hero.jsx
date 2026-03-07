// src/Hero.jsx
import { Trophy } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="
        w-full rounded-xl
        bg-gradient-to-r
        from-[#0b1f18]
        via-[#113529]
        to-[#0b1f18]
        border border-emerald-500/15
        px-8 py-6
        flex justify-between items-center
        shadow-[inset_0_0_0_1px_rgba(16,185,129,0.05),0_0_40px_rgba(0,0,0,0.6)]
      "
    >
      
      {/* Left Content */}
      <div className="space-y-3 max-w-xl">
        <span
          className="
            inline-flex items-center gap-1
            px-3 py-1 rounded-full
            bg-emerald-500/10
            border border-emerald-400/30
            text-[11px] text-emerald-300
          "
        >
          SEPM Project
        </span>

        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Cricket Tournament
            <span className="block text-emerald-400">
              Management System
            </span>
          </h1>

          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            A comprehensive platform for organizing cricket tournaments,
            managing teams, tracking live scores, and maintaining points tables.
          </p>
        </div>
      </div>

      {/* Right Icon */}
      <div className="hidden md:flex">
        <div
          className="
            w-28 h-28 rounded-full
            bg-[#22c55e]
            flex items-center justify-center
            shadow-[0_0_20px_rgba(34,197,94,0.45)]
          "
        >
          <Trophy size={42} className="text-[#052e1c]" />
        </div>
      </div>
    </section>
  );
}
