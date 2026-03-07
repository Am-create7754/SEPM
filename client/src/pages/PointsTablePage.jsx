import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getTournaments } from "../utils/storage";

export default function PointsTablePage() {
  const [tournaments, setTournaments] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const all = getTournaments() || [];
    setTournaments(all);

    if (all.length > 0) {
      setActiveId(all[0].id);
    }
  }, []);

  const activeTournament = tournaments.find(
    (t) => t.id === activeId
  );

  function getSortedTable(table) {
    if (!table) return [];

    return [...table]
      .sort((a, b) => {
        if (b.points !== a.points)
          return b.points - a.points;

        if (b.won !== a.won)
          return b.won - a.won;

        return 0; // NRR future me add kar sakte hain
      })
      .map((team, index) => ({
        ...team,
        pos: index + 1,
      }));
  }

  const sortedTable = getSortedTable(
    activeTournament?.pointsTable
  );

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-20 py-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">
              Points Table
            </h1>
            <p className="text-sm text-emerald-300 mt-1">
              Tournament standings and rankings
            </p>
          </div>

          {/* Dynamic Tournament Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tournaments.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`px-4 py-2 rounded-lg text-sm transition
                  ${
                    activeId === t.id
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
                    <th className="w-16 pr-5 text-center">
                      Pts
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedTable.map((row) => (
                    <tr
                      key={row.team}
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

                      <td className="text-center">
                        {row.played}
                      </td>

                      <td className="text-center text-emerald-400">
                        {row.won}
                      </td>

                      <td className="text-center text-red-400">
                        {row.lost}
                      </td>

                      <td className="pr-5 text-center font-semibold">
                        {row.points}
                      </td>
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
