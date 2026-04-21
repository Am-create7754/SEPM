import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { Trash2, UserPlus, ArrowLeft } from "lucide-react";

export default function ManageTeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerRole, setPlayerRole] = useState("Batsman");

  /* =========================
     FETCH SINGLE TEAM
  ========================= */
  async function fetchTeam() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/teams/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (id) fetchTeam();
  }, [id]);

  /* =========================
     ADD PLAYER
  ========================= */
  async function addPlayer() {
    if (!playerName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/teams/${id}/add-player`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: playerName,
          role: playerRole
        })
      });

      setPlayerName("");
      fetchTeam(); // refresh

    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     ADD MYSELF
  ========================= */
  async function addMyself() {
    try {
      const token = localStorage.getItem("token");
      const userRes = await fetch("http://localhost:5001/api/admin/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!userRes.ok) {
        alert("Please create a player profile first!");
        return;
      }

      const userData = await userRes.json();
      if (!userData.playerRole) {
        alert("Please set up your player profile first!");
        return;
      }

      const res = await fetch(`http://localhost:5001/api/teams/${id}/add-player`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userData.name,
          role: userData.playerRole
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.msg || "Failed to add yourself.");
        return;
      }

      fetchTeam(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to add yourself.");
    }
  }

  /* =========================
     REMOVE PLAYER
  ========================= */
  async function removePlayer(index) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/teams/${id}/remove-player`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ index })
      });

      fetchTeam();

    } catch (err) {
      console.error(err);
    }
  }

  /* =========================
     DELETE TEAM
  ========================= */
  async function deleteTeam() {
    const confirmDelete = window.confirm("Delete this team?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/teams/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      navigate("/create-team");

    } catch (err) {
      console.error(err);
    }
  }

  if (!team) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 px-24 py-8 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/create-team")}
              className="p-2 rounded-md border border-emerald-500/20"
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <h1 className="text-xl font-semibold">{team.name}</h1>
              <p className="text-xs text-slate-400">
                Players ({team.members.length}/{team.maxPlayers})
              </p>
            </div>
          </div>

          {/* Players List */}
          <div className="max-w-xl space-y-3 mb-6">
            {team.members.map((player, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-black/40 border border-emerald-500/20 rounded-md px-4 py-2"
              >
                <div>
                  <p className="text-emerald-300">{player.name}</p>
                  <p className="text-xs text-slate-400">{player.role}</p>
                </div>

                <button
                  onClick={() => removePlayer(index)}
                  className="text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Player */}
          {team.members.length < team.maxPlayers && (
            <div className="flex gap-2 max-w-xl">
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Player name"
                className="flex-1 px-3 py-2 bg-black border rounded-md text-sm"
              />

              <select
                value={playerRole}
                onChange={(e) => setPlayerRole(e.target.value)}
                className="px-2 py-2 bg-black border rounded-md"
              >
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-Rounder</option>
                <option>Wicket-Keeper</option>
              </select>

              <button
                onClick={addPlayer}
                className="px-3 py-2 bg-emerald-500 text-black rounded-md flex items-center gap-1"
              >
                <UserPlus size={14} />
                Add
              </button>

              <button
                onClick={addMyself}
                className="px-3 py-2 bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700 transition rounded-md flex items-center gap-1"
              >
                <UserPlus size={14} />
                Add Myself
              </button>
            </div>
          )}

          {/* Delete Team */}
          <div className="mt-8">
            <button
              onClick={deleteTeam}
              className="text-red-400 text-xs"
            >
              Delete Team
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}