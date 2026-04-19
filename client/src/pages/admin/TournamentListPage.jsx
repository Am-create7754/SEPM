import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Trophy, Plus, Trash2, Lock, Loader2 } from "lucide-react";

import {
  isSuperAdmin,
  isOrganiser
} from "../../utils/permissions";
import { getUser } from "../../utils/auth";

export default function TournamentListPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = getUser();
  const token = localStorage.getItem("token");
  const isAllowed = isSuperAdmin(user) || isOrganiser(user);

  /* =========================
      FETCH TOURNAMENTS (DB)
  ========================= */
  async function fetchTournaments() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tournaments", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setTournaments(data);
      } else {
        setTournaments([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchTournaments();
    } else {
      navigate("/login");
    }
  }, []);

  /* =========================
      DELETE TOURNAMENT
  ========================= */
  async function handleDeleteTournament(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tournament?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tournaments/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchTournaments();
      } else {
        alert("Failed to delete. Check permissions.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-8 md:px-24 py-8 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-emerald-500 mb-1">
                Tournaments
              </h1>
              <p className="text-xs text-slate-400">
                Manage your hosted arenas and view stats
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => isAllowed && navigate("/admin/create-tournament")}
                disabled={!isAllowed}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg
                  ${isAllowed
                    ? "bg-emerald-500 text-[#010806] hover:bg-emerald-400 hover:scale-105 active:scale-95"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                  }
                `}
              >
                <Plus size={18} strokeWidth={3} />
                Create Tournament
              </button>

              {!isAllowed && (
                <div className="flex items-center gap-1.5 text-amber-500/80 text-[10px] font-bold uppercase tracking-widest bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/10">
                  <Lock size={12} />
                  Organiser Access Only
                </div>
              )}
            </div>
          </div>

          {/* List Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-emerald-500" size={32} />
              <p className="text-xs text-slate-500 font-medium">Fetching Arenas...</p>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="max-w-xl rounded-2xl border border-emerald-500/10 bg-black/40 p-10 text-center">
              <Trophy size={40} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-400 font-medium">
                No tournaments found for your account.
              </p>
              <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-tighter">
                Click create to start your first season
              </p>
            </div>
          ) : (
            <div className="grid gap-5 max-w-4xl">
              {tournaments.map(t => (
                <div
                  key={t._id}
                  onClick={() => navigate(`/tournaments/${t._id}`)}
                  className="group relative cursor-pointer rounded-2xl border border-emerald-500/10 bg-[#050505] p-6 hover:border-emerald-500/40 hover:bg-[#080808] transition-all duration-300 shadow-xl"
                >
                  {/* Delete Button - Visibility fixed */}
                  {isAllowed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTournament(t._id);
                      }}
                      className="absolute top-4 right-4 text-red-500/70 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                      <Trophy size={24} />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-emerald-100 group-hover:text-emerald-400 transition-colors">
                        {t.name}
                      </h2>

                      <div className="flex gap-4 mt-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Teams</span>
                          <span className="text-sm font-bold text-slate-300">{t.teams?.length || 0}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-800 self-center"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Matches</span>
                          <span className="text-sm font-bold text-slate-300">{t.matches?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">View Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}