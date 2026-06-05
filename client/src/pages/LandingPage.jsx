import { Link, useNavigate } from "react-router-dom";
import { Trophy, Activity, Users, ChevronRight, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#010806] text-white flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <header className="w-full flex items-center justify-between px-8 md:px-24 py-6 border-b border-emerald-500/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Trophy size={20} className="text-[#010806]" />
          </div>
          <span className="text-xl font-black tracking-tight text-emerald-50">
            CricScore<span className="text-emerald-500">Arena</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-5 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm font-bold hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="z-10 max-w-4xl space-y-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Zap size={14} className="text-emerald-400" />
            The Ultimate Cricket Management Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-slate-50">
            Manage your tournaments <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              like a true champion.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            Create teams, schedule matches, track real-time scores, and maintain automated points tables in one sleek, unified arena.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-6">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 rounded-xl bg-emerald-500 text-black font-black text-sm uppercase tracking-wide hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2 group"
            >
              Start Playing Now
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl bg-black border border-emerald-500/30 text-emerald-50 font-black text-sm uppercase tracking-wide hover:bg-emerald-500/10 transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            >
              Host a Tournament
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-32 z-10">
          <FeatureCard 
            icon={<Trophy size={24} />}
            title="Tournament Hosting"
            desc="Easily create and manage seasons, approve team requests, and schedule matches with a few clicks."
          />
          <FeatureCard 
            icon={<Activity size={24} />}
            title="Live Match Scoring"
            desc="Track ball-by-ball updates, fall of wickets, and auto-calculate run rates in real-time."
          />
          <FeatureCard 
            icon={<ShieldCheck size={24} />}
            title="Automated Points Table"
            desc="Forget manual calculations. Wins, losses, and NRR are updated instantly after every match."
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-xs text-slate-500 font-bold uppercase tracking-widest border-t border-emerald-500/10 bg-black/40">
        © 2026 CricScore Arena. Built for SEPM Project.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gradient-to-br from-[#0a2a1f] to-[#041511] border border-emerald-500/20 p-8 rounded-2xl hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.05)] text-left group">
      <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-emerald-50 mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
