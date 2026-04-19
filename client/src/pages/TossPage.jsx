import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function TossPage() {

  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match,setMatch] = useState(null);
  const [winner,setWinner] = useState(null);
  const [decision,setDecision] = useState("");

  /* =========================
     FETCH MATCH
  ========================= */
  useEffect(()=>{

    async function fetchMatch(){
      try{
        const res = await fetch(`http://localhost:5000/api/matches/${matchId}`);
        const data = await res.json();
        setMatch(data);
      }catch(err){
        console.error("Error fetching match:", err);
      }
    }

    fetchMatch();

  },[matchId]);

  // Ye function component ke andar bana
  async function handlePlay() {
    try {
      await fetch(`http://localhost:5000/api/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toss: { 
            winner: winner.name, 
            decision 
          }
        })
      });
      navigate(`/player-selection/${matchId}`);
    } catch (err) {
      console.error(err);
    }
  }

  if(!match){
    return <div className="text-white p-10">Loading Toss...</div>;
  }

  const ready = winner && decision;

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">

      <Navbar/>

      <div className="flex flex-1 overflow-hidden">

        <Sidebar/>

        <main className="flex-1 px-24 py-8 overflow-y-auto">

          <div className="max-w-3xl mx-auto">

            <h1 className="text-xl font-semibold mb-6 text-center">
              Who won the toss?
            </h1>

            {/* TEAMS */}
            <div className="flex justify-between mb-8">

              <TeamCard
                team={match.teamA}
                active={winner?._id === match.teamA?._id}
                onClick={()=>setWinner(match.teamA)}
              />

              <TeamCard
                team={match.teamB}
                active={winner?._id === match.teamB?._id}
                onClick={()=>setWinner(match.teamB)}
              />

            </div>

            {/* WINNER TEXT */}
            {winner && (
              <div className="text-center mb-8">
                <p className="text-emerald-400 font-medium text-sm">
                  {winner.name} won the toss
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  What will they choose?
                </p>
              </div>
            )}

            {/* DECISION */}
            {winner && (
              <div className="flex justify-center gap-8 mb-10">

                <DecisionCard
                  label="Bat"
                  icon="🏏"
                  active={decision==="bat"}
                  onClick={()=>setDecision("bat")}
                />

                <DecisionCard
                  label="Bowl"
                  icon="🎯"
                  active={decision==="bowl"}
                  onClick={()=>setDecision("bowl")}
                />

              </div>
            )}

            {/* BUTTON */}
            <button
              disabled={!ready}
              onClick={handlePlay}
              className={`
                w-full py-3 rounded-lg text-sm font-medium
                ${
                  ready
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              Let's Play
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================
   TEAM CARD (FIXED)
========================= */
function TeamCard({team,active,onClick}){

  const name = team?.name || "";

  const initials = name
    .split(" ")
    .map(w=>w[0])
    .join("")
    .slice(0,2)
    .toUpperCase();

  return(
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-xl
        p-6
        w-[45%]
        text-center
        border
        ${
          active
          ? "border-emerald-400 bg-emerald-500/20"
          : "border-emerald-500/20 bg-black/40"
        }
      `}
    >

      <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center text-lg font-bold mx-auto mb-2">
        {initials}
      </div>

      <p className="text-sm text-emerald-300">{name}</p>

    </div>
  )
}

/* =========================
   DECISION CARD
========================= */
function DecisionCard({label,icon,active,onClick}){

  return(
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        rounded-xl
        p-6
        w-36
        text-center
        border
        ${
          active
          ? "border-emerald-400 bg-emerald-500/20"
          : "border-emerald-500/20 bg-black/40"
        }
      `}
    >

      <div className="text-3xl mb-2">
        {icon}
      </div>

      <p className="text-sm font-medium">
        {label}
      </p>

    </div>
  )
}