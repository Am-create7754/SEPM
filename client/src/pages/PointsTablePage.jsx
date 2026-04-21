import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function PointsTablePage() {
  const [tournaments, setTournaments] = useState([]);
  const [activeId, setActiveId] = useState(null);

  /* =========================
     FETCH TOURNAMENTS + POINTS
  ========================= */
  useEffect(() => {
    async function fetchTournaments() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/tournaments", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setTournaments(data || []);

        if (data.length > 0) {
          setActiveId(data[0]._id); // Fallback to first tournament ID
        }
      } catch (err) {
        console.error("Error fetching points table:", err);
      }
    }
    fetchTournaments();
  }, []);

  const activeTournament = tournaments.find((t) => t._id === activeId);

  function getSortedTable(tournament) {
    if (!tournament || !tournament.teams) return [];

    const tableMap = {};
    
    // Initialize points table template with all tournament teams
    tournament.teams.forEach(t => {
      const id = t._id?.toString() || t.toString();
      tableMap[id] = { 
        id: id, 
        team: t.name || "Unknown Team", 
        played: 0, 
        won: 0, 
        lost: 0, 
        points: 0 
      };
    });

    // Compute metrics from completed matches
    if (tournament.matches && Array.isArray(tournament.matches)) {
      tournament.matches.forEach(m => {
        if (m.status?.toLowerCase() === 'completed' && m.winner) {
          const taId = (m.teamA?._id || m.teamA)?.toString();
          const tbId = (m.teamB?._id || m.teamB)?.toString();
          const wId = (m.winner?._id || m.winner)?.toString();

          [taId, tbId].forEach(teamId => {
            if (teamId && tableMap[teamId]) {
              tableMap[teamId].played += 1;
              if (wId === teamId) {
                tableMap[teamId].won += 1;
                tableMap[teamId].points += 2;
              } else {
                tableMap[teamId].lost += 1;
              }
            }
          });
        }
      });
    }

    return Object.values(tableMap)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.won !== a.won) return b.won - a.won;
        return 0; 
      })
      .map((team, index) => ({
        ...team,
        pos: index + 1,
      }));
  }

  const sortedTable = getSortedTable(activeTournament);

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-20 py-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Points Table</h1>
            <p className="text-sm text-emerald-300 mt-1">
              Tournament standings and rankings
            </p>
          </div>

          {/* Dynamic Tournament Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tournaments.map((t) => (
              <button
                key={t._id}
                onClick={() => setActiveId(t._id)}
                className={`px-4 py-2 rounded-lg text-sm transition
                  ${
                    activeId === t._id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-black/40 text-slate-400 border border-slate-700"
                  }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Table */}
          {activeTournament ? (
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] overflow-hidden">
              <div className="px-5 py-4 font-semibold">
                {activeTournament.name} - Standings
              </div>

              <table className="w-full text-sm table-fixed">
                <thead className="text-slate-400 border-t border-emerald-500/20">
                  <tr>
                    <th className="w-14 px-5 py-3 text-left">#</th>
                    <th className="text-left">Team</th>
                    <th className="text-center">P</th>
                    <th className="text-center">W</th>
                    <th className="text-center">L</th>
                    <th className="w-16 pr-5 text-center">Pts</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedTable.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-emerald-500/10 hover:bg-emerald-500/5 transition"
                    >
                      <td className="px-5 py-3 text-left">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                          {row.pos}
                        </span>
                      </td>

                      <td className="font-medium text-left text-emerald-300">
                        {row.team}
                      </td>

                      <td className="text-center">{row.played}</td>
                      <td className="text-center text-emerald-400">{row.won}</td>
                      <td className="text-center text-red-400">{row.lost}</td>
                      <td className="pr-5 text-center font-semibold">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-5 py-3 text-[11px] text-slate-400 border-t border-emerald-500/20">
                Points: Win = 2 pts | Loss = 0 pts
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/20 bg-black/40 p-6 text-slate-400 text-sm">
              No tournaments available.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}