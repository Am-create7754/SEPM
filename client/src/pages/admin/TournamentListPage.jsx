import { useEffect, useState } from "react";
import { getTournaments } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Trophy, Plus, Trash2 } from "lucide-react";
import { isSuperAdmin, isTournamentOwner, isOrganiser } from "../../utils/permissions";
import { getUser } from "../../utils/auth";
import { Lock } from "lucide-react";



export default function TournamentListPage() {
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();
const user = getUser();
const isAllowed = isSuperAdmin(user) || isOrganiser(user);
  


  useEffect(() => {
    setTournaments(getTournaments());
  }, []);
  function handleDeleteTournament(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this tournament?"
  );

  if (!confirmDelete) return;

  const updated = tournaments.filter(t => t.id !== id);

  localStorage.setItem("tournaments", JSON.stringify(updated));
  setTournaments(updated);
}


  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold mb-1">
                Tournaments
              </h1>
              <p className="text-xs text-slate-400">
                Manage and view all created tournaments
              </p>
            </div>

            <div className="flex items-center gap-3">

  <button
    onClick={() => isAllowed && navigate("/admin/create-tournament")}
    disabled={!isAllowed}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
      ${
        isAllowed
          ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
          : "bg-gray-700 text-gray-400 cursor-not-allowed"
      }
    `}
  >
    <Plus size={16} />
    Create Tournament
  </button>

  {!isAllowed && (
    <div className="flex items-center gap-1 text-red-400 text-xs">
      <Lock size={14} />
      Organiser Access Only
    </div>
  )}

</div>

          </div>

          {/* List */}
          {tournaments.length === 0 ? (
            <div className="max-w-xl rounded-xl border border-emerald-500/20 bg-black/40 p-6">
              <p className="text-slate-400">
                No tournaments created yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 max-w-3xl">
             {tournaments.map(t => (
  <div
    key={t.id}
    onClick={() => navigate(`/tournaments/${t.id}`)}
    className="relative cursor-pointer rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-6 hover:border-emerald-400/40 transition"
  >

    {/* Delete Button */}
    {(isSuperAdmin(user) || isTournamentOwner(user, t)) && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteTournament(t.id);
    }}
    className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition"
  >
    <Trash2 size={16} />
  </button>
)}


    <div className="flex items-center gap-3 mb-2">
      <Trophy size={18} className="text-emerald-400" />
      <h2 className="font-semibold text-emerald-300">
        {t.name}
      </h2>
    </div>

    <p className="text-xs text-slate-400">
      Teams: {t.teams.length}
    </p>

    <p className="text-xs text-slate-500 mt-1">
      Matches Scheduled: {t.matches.length}
    </p>
  </div>
))}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
