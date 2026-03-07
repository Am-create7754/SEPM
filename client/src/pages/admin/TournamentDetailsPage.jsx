import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getTournaments,
  saveTournaments,
  getAllMatches,
  saveAllMatches,
} from "../../utils/storage";
import { getUser } from "../../utils/auth";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Calendar, Plus, Trash2, XCircle } from "lucide-react";

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const isAdmin =
    user?.role === "organiser" ||
    user?.role === "superadmin";

  const [tournament, setTournament] = useState(null);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const t = getTournaments().find((t) => String(t.id) === id);
    setTournament(t);
  }, [id]);

  /* =========================
     CREATE MATCH
  ==========================*/
  function createMatch() {
    if (!isAdmin) return;

    if (!teamA || !teamB || teamA === teamB) {
      alert("Select two different teams");
      return;
    }

    const newMatch = {
      id: Date.now(),
      tournamentId: id,
      tournamentName: tournament.name,
      teamA,
      teamB,
      date,
      status: "upcoming",
      score: {
        teamA: { runs: 0, wickets: 0, overs: 0 },
        teamB: { runs: 0, wickets: 0, overs: 0 },
      },
    };

    const tournaments = getTournaments();

    const updatedTournaments = tournaments.map((t) => {
      if (String(t.id) === id) {
        return {
          ...t,
          matches: [...t.matches, newMatch],
        };
      }
      return t;
    });

    saveTournaments(updatedTournaments);

    const allMatches = getAllMatches();
    saveAllMatches([...allMatches, newMatch]);

    const refreshed = updatedTournaments.find(
      (t) => String(t.id) === id
    );
    setTournament(refreshed);

    setTeamA("");
    setTeamB("");
    setDate("");

    alert("Match Scheduled ✅");
  }

  function cancelMatch(matchId) {
    if (!isAdmin) return;
    if (!window.confirm("Cancel this match?")) return;

    const tournaments = getTournaments();

    const updatedTournaments = tournaments.map((t) => {
      if (String(t.id) === id) {
        return {
          ...t,
          matches: t.matches.map((m) =>
            m.id === matchId ? { ...m, status: "cancelled" } : m
          ),
        };
      }
      return t;
    });

    saveTournaments(updatedTournaments);

    const allMatches = getAllMatches();
    const updatedGlobalMatches = allMatches.map((m) =>
      m.id === matchId ? { ...m, status: "cancelled" } : m
    );

    saveAllMatches(updatedGlobalMatches);

    const refreshed = updatedTournaments.find(
      (t) => String(t.id) === id
    );
    setTournament(refreshed);
  }

  function deleteMatch(matchId) {
    if (!isAdmin) return;
    if (!window.confirm("Permanently delete this match?")) return;

    const tournaments = getTournaments();

    const updatedTournaments = tournaments.map((t) => {
      if (String(t.id) === id) {
        return {
          ...t,
          matches: t.matches.filter((m) => m.id !== matchId),
        };
      }
      return t;
    });

    saveTournaments(updatedTournaments);

    const allMatches = getAllMatches();
    const updatedGlobalMatches = allMatches.filter(
      (m) => m.id !== matchId
    );

    saveAllMatches(updatedGlobalMatches);

    const refreshed = updatedTournaments.find(
      (t) => String(t.id) === id
    );
    setTournament(refreshed);
  }

  if (!tournament) return null;

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold mb-1">
              {tournament.name}
            </h1>
            <p className="text-xs text-slate-400">
              Manage matches and schedule games
            </p>
          </div>

          {/* =========================
             Schedule Section (Visible but Disabled for Player)
          ========================== */}
          <div className="max-w-3xl rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-6 mb-8">

            {!isAdmin && (
              <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-900/20 p-3 text-yellow-300 text-xs">
                ⚠ Organiser Access Only — Only organisers can schedule matches.
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-emerald-400" />
              <h2 className="text-sm font-medium text-emerald-300">
                Schedule New Match
              </h2>
            </div>

            <div className={`grid grid-cols-3 gap-4 ${!isAdmin ? "opacity-50 pointer-events-none" : ""}`}>
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
              >
                <option className="bg-black" value="">Select Team A</option>
                {tournament.teams.map((t) => (
                  <option className="bg-black" key={t}>{t}</option>
                ))}
              </select>

              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
              >
                <option className="bg-black" value="">Select Team B</option>
                {tournament.teams.map((t) => (
                  <option className="bg-black" key={t}>{t}</option>
                ))}
              </select>

              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
              />
            </div>

            <button
              onClick={createMatch}
              disabled={!isAdmin}
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                ${
                  isAdmin
                    ? "bg-emerald-500 text-black hover:bg-emerald-400"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              <Plus size={16} />
              Schedule Match
            </button>
          </div>

          {/* =========================
             Matches List
          ========================== */}
          <div className="max-w-3xl grid gap-4">
            {tournament.matches.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-4 text-slate-400 text-sm">
                No matches scheduled yet.
              </div>
            ) : (
              tournament.matches.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl p-4 border
                    ${
                      m.status === "cancelled"
                        ? "bg-red-900/30 border-red-500/40 opacity-80"
                        : "bg-black/40 border-emerald-500/20"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-emerald-300">
                      {m.teamA} vs {m.teamB}
                    </p>

                    <span className="text-xs px-2 py-1 rounded-full capitalize bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {m.status}
                    </span>
                  </div>

                  {m.date && (
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(m.date).toLocaleString()}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    {m.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          navigate(`/play-match/${m.id}`)
                        }
                        className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs px-3 py-2 rounded-lg"
                      >
                        Start Playing
                      </button>
                    )}

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => cancelMatch(m.id)}
                          className="flex items-center gap-1 text-xs text-yellow-400"
                        >
                          <XCircle size={14} />
                          Cancel
                        </button>

                        <button
                          onClick={() => deleteMatch(m.id)}
                          className="flex items-center gap-1 text-xs text-red-500"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  {m.status === "cancelled" && (
                    <p className="mt-2 text-xs text-red-400 font-medium">
                      This match has been cancelled.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
