import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { getAllMatches } from "../utils/storage";

export default function PlayMatch() {

  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match,setMatch] = useState(null);

  const [matchType,setMatchType] = useState("limited");
  const [overs,setOvers] = useState("");
  const [ballsPerOver,setBallsPerOver] = useState(6);
  const [powerplay,setPowerplay] = useState("");
  const [ground,setGround] = useState("");
  const [city,setCity] = useState("");
  const [date,setDate] = useState("");
  const [ballType,setBallType] = useState("white");

  const grounds = [
    "Wankhede Stadium",
    "Eden Gardens",
    "Narendra Modi Stadium",
    "M Chinnaswamy Stadium",
    "Arun Jaitley Stadium",
    "MA Chidambaram Stadium",
    "Rajiv Gandhi International Stadium",
    "Punjab Cricket Association Stadium",
    "Greenfield Stadium",
    "Barsapara Cricket Stadium"
  ];

  useEffect(()=>{

    const matches = getAllMatches();
    const found = matches.find(m => String(m.id) === matchId);

    setMatch(found);

  },[matchId]);


  /* =========================
     MATCH TYPE AUTO BALL
  ========================== */

  useEffect(()=>{

    if(matchType === "test"){
      setBallType("red");
    }else{
      setBallType("white");
    }

  },[matchType]);


  if(!match) return null;


  const isValid =
    overs &&
    ballsPerOver &&
    powerplay &&
    ground &&
    city &&
    date &&
    ballType;

  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">

      <Navbar/>

      <div className="flex flex-1 overflow-hidden">

        <Sidebar/>

        <main className="flex-1 px-24 py-8 overflow-y-auto">

          {/* =========================
              TEAMS HEADER
          ========================== */}

          <div className="flex justify-between max-w-3xl mb-6">

            <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 w-[45%] text-center">
              <p className="text-emerald-300 font-medium">{match.teamA}</p>
              <p className="text-xs text-slate-400 mt-1">Squad (11)</p>
            </div>

            <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 w-[45%] text-center">
              <p className="text-emerald-300 font-medium">{match.teamB}</p>
              <p className="text-xs text-slate-400 mt-1">Squad (11)</p>
            </div>

          </div>


          {/* =========================
             MATCH SETUP CARD
          ========================== */}

          <div className="max-w-3xl rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-6">


            {/* MATCH TYPE */}

            <div className="flex gap-6 mb-6 text-sm">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={matchType==="limited"}
                  onChange={()=>setMatchType("limited")}
                />
                Limited Overs
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={matchType==="test"}
                  onChange={()=>setMatchType("test")}
                />
                Test Match
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={matchType==="hundred"}
                  onChange={()=>setMatchType("hundred")}
                />
                The Hundred
              </label>

            </div>


            {/* OVERS */}

            <div className="grid grid-cols-3 gap-4 mb-6">

              <input
                placeholder="No. of Overs"
                value={overs}
                onChange={(e)=>setOvers(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
              />

              <input
                placeholder="Balls per Over"
                value={ballsPerOver}
                onChange={(e)=>setBallsPerOver(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
              />

              <input
                placeholder="Powerplay Overs"
                value={powerplay}
                onChange={(e)=>setPowerplay(e.target.value)}
                className="px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
              />

            </div>


            {/* CITY */}

            <input
              placeholder="City / Town"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
            />


            {/* GROUND */}

            <select
              value={ground}
              onChange={(e)=>setGround(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
            >

              <option className="bg-black" value="">Select Ground</option>

              {grounds.map(g=>(
                <option className="bg-black" key={g}>{g}</option>
              ))}

            </select>


            {/* DATE */}

            <input
              type="datetime-local"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="w-full mb-6 px-3 py-2 rounded-md bg-black/40 border border-emerald-500/20 text-sm"
            />


            {/* BALL TYPE */}

            <div className="flex items-center gap-4 mb-6">

              <p className="text-sm text-slate-300">Ball Type</p>

              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${ballType==="white" ? "border-emerald-400":"border-slate-500"}`}>
                ⚪
              </div>

              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${ballType==="red" ? "border-emerald-400":"border-slate-500"}`}>
                🔴
              </div>

            </div>


            {/* NEXT BUTTON */}

            <button
              disabled={!isValid}
              onClick={()=>navigate(`/match/${matchId}/toss`)}
              className={`w-full py-3 rounded-lg text-sm font-medium
                ${
                  isValid
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              Next (Toss)
            </button>


          </div>


        </main>

      </div>

    </div>
  );
}