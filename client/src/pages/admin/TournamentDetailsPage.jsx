import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { Calendar, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import { getUser } from "../../utils/auth";
import { isSuperAdmin, isOrganiser } from "../../utils/permissions";

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(null);
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [date, setDate] = useState("");

  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeamToJoin, setSelectedTeamToJoin] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const user = getUser();
  const token = localStorage.getItem("token");
  const isAllowed = isSuperAdmin(user) || isOrganiser(user);

  /* =========================
     FETCH TOURNAMENT (DB)
  ========================= */
  async function fetchTournament() {
    try {
      const res = await fetch(`http://localhost:5001/api/tournaments/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setTournament(data);
    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     FETCH MY TEAMS (PLAYER)
  ========================= */
  async function fetchMyTeams() {
    if (isAllowed) return; // Organisers don't need this to join
    try {
      const res = await fetch("http://localhost:5001/api/teams", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setMyTeams(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (id) {
      fetchTournament();
      fetchMyTeams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      if(res.ok) {
        alert("Match Scheduled ✅");
        setTeamA("");
        setTeamB("");
        setDate("");
        fetchTournament();
      } else {
        alert("Failed to schedule match");
      }

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
      await fetch(`http://localhost:5001/api/matches/${matchId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      fetchTournament();

    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     JOIN TOURNAMENT
  ========================= */
  async function handleJoinTournament() {
    if (!selectedTeamToJoin) {
      alert("Please select a team to join with.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/tournaments/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ teamId: selectedTeamToJoin })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Join request sent successfully! ✅");
        setIsJoinModalOpen(false);
        fetchTournament();
      } else {
        alert(data.message || "Failed to send join request.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending join request.");
    }
  }

  /* =========================
     APPROVE / REJECT REQUEST
  ========================= */
  async function handleRequestUpdate(requestId, status) {
    try {
      const res = await fetch(`http://localhost:5001/api/tournaments/${id}/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Request ${status} successfully! ✅`);
        fetchTournament();
      } else {
        alert(data.message || "Failed to update request.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating request.");
    }
  }

  if (!tournament) {
    return <div className="text-white p-10">Loading...</div>;
  }

  const myApprovedTeams = myTeams.filter(myT => 
    tournament?.teams?.some(t => t._id === myT._id)
  );
  const hasApprovedTeam = myApprovedTeams.length > 0;
  const canScheduleMatches = isAllowed || hasApprovedTeam;

  const displayedMatches = isAllowed 
    ? tournament.matches 
    : tournament.matches.filter(m => m.status !== "completed");

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-semibold mb-1">
                {tournament.name}
              </h1>
              <p className="text-xs text-slate-400">
                {isAllowed ? "Schedule and manage matches" : "Tournament Details"}
              </p>
            </div>
            {!isAllowed && (
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-emerald-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition"
              >
                Join Tournament
              </button>
            )}
          </div>

          {/* Join Modal for Players */}
          {isJoinModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-[#050505] border border-emerald-500/20 p-6 rounded-xl w-96 shadow-2xl">
                <h2 className="text-lg font-bold text-emerald-500 mb-4">Join Tournament</h2>
                <p className="text-sm text-slate-400 mb-4">Select the team you want to enroll in this tournament.</p>
                <select 
                  value={selectedTeamToJoin} 
                  onChange={(e) => setSelectedTeamToJoin(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-emerald-500/20 rounded-md text-sm mb-4"
                >
                  <option value="">-- Select Team --</option>
                  {myTeams.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsJoinModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                  <button onClick={handleJoinTournament} className="px-4 py-2 bg-emerald-500 text-black font-bold text-sm rounded-md hover:bg-emerald-400">Send Request</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-8">
            <div className="flex-1">
              {/* =========================
                 Schedule Match
              ========================= */}
              {canScheduleMatches && (
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
                      className="px-3 py-2 rounded-md bg-black border border-slate-800 text-sm"
                    >
                      <option value="">Team A</option>
                      {(!isAllowed ? myApprovedTeams : tournament.teams).map(team => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>

                    {/* Team B */}
                    <select
                      value={teamB}
                      onChange={(e) => setTeamB(e.target.value)}
                      className="px-3 py-2 rounded-md bg-black border border-slate-800 text-sm"
                    >
                      <option value="">Team B</option>
                      {tournament.teams.filter(t => t._id !== teamA).map(team => (
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
                      className="px-3 py-2 rounded-md bg-black border border-slate-800 text-sm"
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
              )}

              {/* =========================
                 MATCHES LIST
              ========================= */}
              <div className="max-w-3xl grid gap-4 mb-8">
                <h2 className="text-sm font-medium text-emerald-300 mb-2">Matches</h2>
                {displayedMatches.length === 0 ? (
                  <div className="p-4 text-slate-400 bg-black/20 rounded-xl border border-slate-800">
                    No matches scheduled yet
                  </div>
                ) : (
                  displayedMatches.map((m) => (
                    <div
                      key={m._id}
                      className="rounded-xl p-4 border bg-black/40 border-emerald-500/20"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-emerald-300">
                          {m.teamA?.name || "Unknown"} vs {m.teamB?.name || "Unknown"}
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
                        {isAllowed && (
                          <button
                            onClick={() => deleteMatch(m._id)}
                            className="flex items-center gap-1 text-xs text-red-500"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Teams & Requests */}
            <div className="w-80">
              {/* Teams Enrolled */}
              <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-emerald-400 mb-4">Teams Enrolled</h3>
                {tournament.teams.length === 0 ? (
                  <p className="text-xs text-slate-500">No teams enrolled yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {tournament.teams.map(team => (
                      <li key={team._id} className="text-sm text-slate-300 bg-[#050505] px-3 py-2 rounded-lg border border-slate-800">
                        {team.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Join Requests (Organiser Only) */}
              {isAllowed && (
                <div className="bg-black/40 border border-amber-500/20 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-amber-400 mb-4">Join Requests</h3>
                  {(!tournament.joinRequests || tournament.joinRequests.length === 0) ? (
                    <p className="text-xs text-slate-500">No pending requests.</p>
                  ) : (
                    <div className="space-y-3">
                      {tournament.joinRequests.map(req => (
                        <div key={req._id} className="bg-[#050505] p-3 rounded-lg border border-slate-800 text-sm">
                          <p className="font-medium text-slate-200 mb-1">{req.team?.name || "Unknown Team"}</p>
                          <p className={`text-[10px] uppercase font-bold mb-3 ${req.status === 'pending' ? 'text-amber-500' : req.status === 'approved' ? 'text-emerald-500' : 'text-red-500'}`}>
                            Status: {req.status}
                          </p>
                          
                          {req.status === "pending" && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleRequestUpdate(req._id, "approved")}
                                className="flex-1 flex items-center justify-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 py-1.5 rounded-md hover:bg-emerald-500 hover:text-black transition text-xs font-medium"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button 
                                onClick={() => handleRequestUpdate(req._id, "rejected")}
                                className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition text-xs font-medium"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}