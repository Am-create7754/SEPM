import { Trophy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { isSuperAdmin, isOrganiser } from '../utils/permissions';

export default function Hero() {
  const navigate = useNavigate();
  const user = getUser();
  const isAllowed = isSuperAdmin(user) || isOrganiser(user);

  return (
    <section
      className="
        w-full rounded-2xl
        bg-gradient-to-br
        from-[#0a2a1f]
        via-[#062019]
        to-[#041511]
        border border-emerald-500/20
        p-8 md:p-12
        flex flex-col md:flex-row justify-between items-center
        shadow-[0_0_50px_rgba(16,185,129,0.1)]
        relative overflow-hidden
      "
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Left Content */}
      <div className="space-y-6 max-w-2xl z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          CricScore Arena Dashboard
        </div>

        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-50 tracking-tight leading-tight">
            Welcome back, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              {user?.name || 'Champion'}
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 mt-4 leading-relaxed font-medium">
            {isAllowed 
              ? "Manage your tournaments, approve team requests, and oversee live matches from your command center." 
              : "Track your stats, view upcoming matches, and discover new tournaments to conquer."}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate(isAllowed ? '/admin/create-tournament' : '/tournaments')}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-[#010806] font-extrabold text-sm uppercase tracking-wider hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 group"
          >
            {isAllowed ? 'Host New Tournament' : 'Browse Tournaments'}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right Icon */}
      <div className="hidden md:flex relative z-10">
        <div
          className="
            w-40 h-40 rounded-full
            bg-emerald-500/10
            border border-emerald-500/30
            flex items-center justify-center
            shadow-[0_0_40px_rgba(16,185,129,0.2)]
            relative
          "
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent animate-spin-slow pointer-events-none"></div>
          <Trophy size={64} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>
      </div>
    </section>
  );
}
