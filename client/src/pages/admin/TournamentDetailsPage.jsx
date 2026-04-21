import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Calendar, Plus, Trash2, } from "lucide-react";

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [date, setDate] = useState("");

  /* =========================
     FETCH TOURNAMENT (DB)
  ========================= */
  async function fetchTournament() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/tournaments/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setTournament(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (id) fetchTournament();
  }, [id]);

  /* =========================
     CREATE MATCH
  ========================= */
  async function createMatch() {
    if (!teamA || !teamB || teamA === teamB) {
      alert("Select two different teams");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          teamA,
          teamB,
          date,
          tournamentId: id
        })
      });

      const data = await res.json();

      alert("Match Scheduled ✅");

      setTeamA("");
      setTeamB("");
      setDate("");

      fetchTournament();

    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     DELETE MATCH
  ========================= */
  async function deleteMatch(matchId) {
    if (!window.confirm("Delete this match?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/matches/${matchId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      fetchTournament();

    } catch (err) {
      console.error(err);
    }
  }

  if (!tournament) {
    return <div className="text-white p-10">Loading...</div>;
  }

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
              Schedule and manage matches
            </p>
          </div>

          {/* =========================
             Schedule Match
          ========================= */}
          <div className="max-w-3xl rounded-xl border border-emerald-500/20 bg-black/40 p-6 mb-8">

            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-emerald-400" />
              <h2 className="text-sm font-medium text-emerald-300">
                Schedule Match
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4">

              {/* Team A */}
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="px-3 py-2 rounded-md bg-black border text-sm"
              >
                <option value="">Team A</option>
                {tournament.teams.map(team => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>

              {/* Team B */}
              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="px-3 py-2 rounded-md bg-black border text-sm"
              >
                <option value="">Team B</option>
                {tournament.teams.map(team => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>

              {/* Date */}
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-md bg-black border text-sm"
              />

            </div>

            <button
              onClick={createMatch}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400"
            >
              <Plus size={16} />
              Schedule Match
            </button>
          </div>

          {/* =========================
             MATCHES LIST
          ========================= */}
          <div className="max-w-3xl grid gap-4">
            {tournament.matches.length === 0 ? (
              <div className="p-4 text-slate-400">
                No matches scheduled yet
              </div>
            ) : (
              tournament.matches.map((m) => (
                <div
                  key={m._id}
                  className="rounded-xl p-4 border bg-black/40 border-emerald-500/20"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-emerald-300">
                      {m.teamA?.name} vs {m.teamB?.name}
                    </p>
                  </div>

                  {m.date && (
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(m.date).toLocaleString()}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3">

                    <button
                      onClick={() => navigate(`/play-match/${m._id}`)}
                      className="bg-emerald-500 text-black text-xs px-3 py-2 rounded-lg"
                    >
                      Start Match
                    </button>

                    <button
                      onClick={() => deleteMatch(m._id)}
                      className="flex items-center gap-1 text-xs text-red-500"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}