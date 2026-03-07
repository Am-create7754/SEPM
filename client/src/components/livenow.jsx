// src/LiveNow.jsx
import { Radio, MapPin } from 'lucide-react';

export default function LiveNow() {
  return (
    <section className="mt-6">
      <p className="text-sm font-semibold mb-2 text-slate-200">
        Live Now
      </p>

      <div
        className="
          rounded-xl
          bg-gradient-to-r
          from-[#0a2a1f]
          via-[#062019]
          to-[#041511]
          border border-amber-400/40
          px-5 py-4
          shadow-[0_0_28px_rgba(251,191,36,0.22)]
        "
      >
        
        {/* Header */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 mb-3">
          <div className="flex items-center gap-2">
            
            {/* Live Icon */}
            <span
              className="
                w-4 h-4 rounded-full
                bg-amber-400/20
                flex items-center justify-center
                text-amber-400
                shadow-[0_0_10px_rgba(251,191,36,0.6)]
              "
            >
              <Radio size={10} />
            </span>

            {/* Live Badge */}
            <span
              className="
                px-2 py-0.5 rounded-full
                bg-amber-400/15
                text-amber-300
                border border-amber-400/40
                text-[10px]
              "
            >
              LIVE NOW
            </span>
          </div>

          <span>19:30</span>
        </div>

        {/* Team A */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
           
            <div>
              <p className="text-xs font-semibold text-slate-200">
TBD              </p>
              <p className="text-[10px] text-slate-500">
                {/* Batting or bwoling */}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-slate-100">
          {/* score */}
            </p>
            <p className="text-[11px] text-slate-400">
              {/* (18.3 ov) */}
            </p>
          </div>
        </div>

        {/* VS */}
        <div className="flex items-center justify-center text-[10px] text-slate-500 mb-3">
          <span className="w-16 h-px bg-slate-700/60" />
          <span className="px-2">vs</span>
          <span className="w-16 h-px bg-slate-700/60" />
        </div>

        {/* Team B */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 rounded-full bg-black/40 border border-slate-700 flex items-center justify-center text-[10px] font-semibold">
              MW
            </div> */}
            <div>
              <p className="text-xs font-semibold text-slate-200">
                TBD
              </p>
            </div>
          </div>

          <div className="text-right">
            {/* <p className="text-lg font-semibold text-slate-100">
              142/3
            </p> */}
            {/* <p className="text-[11px] text-slate-400">
              (15.2 ov)
            </p> */}
          </div>
        </div>

        {/* Venue */}
        <p className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center gap-2">
          <MapPin size={12} className="text-slate-400" />
          {/* M. Chinnaswamy Stadium, Bangalore */}
        </p>
      </div>
    </section>
  );
}
