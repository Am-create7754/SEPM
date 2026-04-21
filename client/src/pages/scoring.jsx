import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function ScoringPage() {
  const { matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);

  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [bowler, setBowler] = useState(null);

  const [availableBatters, setAvailableBatters] = useState([]);
  const [availableBowlers, setAvailableBowlers] = useState([]);

  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);

  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState(0);

  const [inning1Score, setInning1Score] = useState(null);

  const [selectedRun, setSelectedRun] = useState(null);
  const [shot, setShot] = useState("");

  const [history, setHistory] = useState([]);

  const [batStats, setBatStats] = useState({});
  const [bowlStats, setBowlStats] = useState({});

  const [inning, setInning] = useState(1);
  const [target, setTarget] = useState(null);

  /* BACK BLOCK */
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePop = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  /* FETCH MATCH */
  useEffect(() => {
    async function fetchMatch() {
      const res = await fetch(`http://localhost:5001/api/matches/${matchId}`);
      const data = await res.json();
      setMatch(data);

      if (location.state) {
        setStriker(location.state.striker);
        setNonStriker(location.state.nonStriker);
        setBowler(location.state.bowler);
      } else {
        setStriker(data.teamA.members[0]);
        setNonStriker(data.teamA.members[1]);
        setBowler(data.teamB.members[0]);
      }
      setAvailableBatters(data.teamA.members);
      setAvailableBowlers(data.teamB.members);
    }
    fetchMatch();
  }, [matchId, location.state]);

  if (!match) return <div className="text-emerald-400 p-10 font-medium">Loading Scoring...</div>;

  const TOTAL_OVERS = Number(match.setup?.overs || 2);

  function saveState() {
    setHistory(prev => [...prev, { runs, wickets, balls, overs, striker, nonStriker, bowler, batStats, bowlStats }]);
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    setRuns(last.runs); setWickets(last.wickets); setBalls(last.balls); setOvers(last.overs);
    setStriker(last.striker); setNonStriker(last.nonStriker); setBowler(last.bowler);
    setBatStats(last.batStats); setBowlStats(last.bowlStats);
    setHistory(prev => prev.slice(0, -1));
  }

  function swapStrike() {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
  }

  async function saveMatch(finalRuns, finalWickets, finalOvers, finalBalls) {
    let matchWinner = null;

    const exactOvers = finalBalls > 0 ? Number(`${finalOvers}.${finalBalls}`) : finalOvers;
    const inning2Score = { runs: finalRuns, wickets: finalWickets, overs: exactOvers };

    if (inning === 2) {
      if (finalRuns >= target) {
        matchWinner = match.teamB._id;
      } else {
        matchWinner = match.teamA._id;
      }
    }

    await fetch(`http://localhost:5001/api/matches/${matchId}/complete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: {
          inning1: inning1Score,
          inning2: inning2Score
        },
        target,
        winner: matchWinner,
        status: "completed"
      })
    });

    const winnerName = matchWinner === match.teamA._id ? match.teamA.name : match.teamB.name;
    alert(`Match Finished 🏆 ${winnerName} won`);
    navigate("/matches");
  }

  function startSecondInning(finalRuns, finalWickets, finalOvers, finalBalls) {
    alert(`1st Innings Complete 🏁 Target is ${finalRuns + 1}`);
    
    const exactOvers = finalBalls > 0 ? Number(`${finalOvers}.${finalBalls}`) : finalOvers;
    
    setInning1Score({ runs: finalRuns, wickets: finalWickets, overs: exactOvers });
    
    setTarget(finalRuns + 1);
    setRuns(0); setWickets(0); setBalls(0); setOvers(0);
    setAvailableBatters(match.teamB.members);
    setAvailableBowlers(match.teamA.members);
    
    setStriker(null); setNonStriker(null); setBowler(null);
    setBatStats({}); setBowlStats({});
    setInning(2);
    setShowBatsmanModal(true);
  }

  function applyBall(run, type = "normal") {
    if (!shot && type === "normal") { alert("Please select a shot direction!"); return; }
    saveState();

    let nextRuns = runs, nextBalls = balls, nextOvers = overs, nextWickets = wickets;
    let strikerStat = batStats[striker?.name] || { runs: 0, balls: 0 };
    let bowlerStat = bowlStats[bowler?.name] || { runs: 0, balls: 0, wickets: 0 };

    if (type === "normal") {
      nextRuns += run; nextBalls += 1;
      strikerStat = { runs: strikerStat.runs + run, balls: strikerStat.balls + 1 };
      bowlerStat = { ...bowlerStat, runs: bowlerStat.runs + run, balls: bowlerStat.balls + 1 };
      if (run % 2 === 1) swapStrike();
    } else if (type === "wd" || type === "nb") {
      nextRuns += 1; setRuns(nextRuns); return;
    } else {
      nextRuns += run; nextBalls += 1;
    }

    let isOverComplete = false;
    if (nextBalls === 6) {
      nextOvers += 1; nextBalls = 0;
      swapStrike();
      isOverComplete = true;
    }

    const isFirstInningEnd = inning === 1 && (nextOvers >= TOTAL_OVERS || nextWickets >= 10);
    const isSecondInningEnd = inning === 2 && (nextOvers >= TOTAL_OVERS || nextWickets >= 10 || nextRuns >= target);

    if (isFirstInningEnd) {
      startSecondInning(nextRuns, nextWickets, nextOvers, nextBalls);
      return;
    }
    if (isSecondInningEnd) {
      saveMatch(nextRuns, nextWickets, nextOvers, nextBalls);
      return;
    }

    setRuns(nextRuns); setBalls(nextBalls); setOvers(nextOvers);
    setBatStats(prev => ({ ...prev, [striker.name]: strikerStat }));
    setBowlStats(prev => ({ ...prev, [bowler.name]: bowlerStat }));

    if (isOverComplete) setShowBowlerModal(true);
    setShot(""); setSelectedRun(null);
  }

  function handleOut() {
    saveState();
    let nextWickets = wickets + 1, nextBalls = balls + 1, nextOvers = overs;
    let bowlerStat = bowlStats[bowler?.name] || { runs: 0, balls: 0, wickets: 0 };
    bowlerStat.wickets += 1;

    let isOverComplete = false;
    if (nextBalls === 6) {
      nextOvers += 1; nextBalls = 0;
      swapStrike();
      isOverComplete = true;
    }

    const isFirstInningEnd = inning === 1 && (nextOvers >= TOTAL_OVERS || nextWickets >= 10);
    const isSecondInningEnd = inning === 2 && (nextOvers >= TOTAL_OVERS || nextWickets >= 10);

    if (isFirstInningEnd) {
      startSecondInning(runs, nextWickets, nextOvers, nextBalls);
      return;
    }
    if (isSecondInningEnd) {
      setWickets(nextWickets); setBalls(nextBalls); setOvers(nextOvers);
      saveMatch(runs, nextWickets, nextOvers, nextBalls);       
      return;
    }

    setWickets(nextWickets); setBalls(nextBalls); setOvers(nextOvers);
    setBowlStats(prev => ({ ...prev, [bowler.name]: bowlerStat }));

    setShowBatsmanModal(true);
    if (isOverComplete) setShowBowlerModal(true);
  }

  function selectNewBatsman(p) {
    if (!striker) {
      setStriker(p);
    } else if (!nonStriker) {
      setNonStriker(p);
      setShowBatsmanModal(false);
      if (!bowler) setShowBowlerModal(true); 
    } else {
      setStriker(p); 
      setShowBatsmanModal(false);
    }
  }

  function selectNewBowler(p) {
    setBowler(p);
    setShowBowlerModal(false);
  }

  const positions = ["Wicketkeeper","Slip","Gully","Point","Cover","Extra Cover","Mid-Off","Mid-On","Square Leg","Fine Leg","Third Man","Deep Point","Deep Cover","Long-Off","Long-On","Deep Mid Wicket","Cow Corner"];

  const getBat = (p) => {
    const s = batStats[p?.name] || { runs: 0, balls: 0 };
    return `${s.runs}(${s.balls})`;
  };

  const getBowl = () => {
    const s = bowlStats[bowler?.name] || { runs: 0, balls: 0, wickets: 0 };
    const ov = Math.floor(s.balls / 6);
    const eco = s.balls ? (s.runs / (s.balls / 6)).toFixed(1) : 0;
    return `${ov}-${s.runs}-${s.wickets}-${eco}`;
  };

  return (
    <div className="min-h-screen bg-[#010806] text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        
        {/* SCORE HEADER */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-6xl font-bold tracking-tight text-emerald-50 drop-shadow-sm">{runs}<span className="text-4xl text-slate-400">/{wickets}</span></h1>
          <p className="text-lg text-emerald-400 mt-2 font-medium bg-emerald-500/10 inline-block px-4 py-1 rounded-full border border-emerald-500/20">{overs}.{balls} overs</p>
          {inning === 2 && <p className="text-sm text-slate-400 mt-3 font-medium">Target: <span className="text-emerald-400 font-bold">{target}</span></p>}
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {[0,1,2,3,4,6].map(r => (
              <button key={r} onClick={() => setSelectedRun(r)} 
                className={`py-4 rounded-xl text-lg font-bold transition-all duration-200 border ${
                  selectedRun === r 
                  ? 'bg-emerald-500 text-[#010806] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-[#0a2a1f] text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50'
                }`}>
                {r}
              </button>
            ))}
            <button onClick={() => applyBall(1,"wd")} className="bg-[#062019] text-slate-300 border border-slate-700 hover:border-emerald-500/40 rounded-xl font-medium transition-colors">WD</button>
            <button onClick={() => applyBall(1,"nb")} className="bg-[#062019] text-slate-300 border border-slate-700 hover:border-emerald-500/40 rounded-xl font-medium transition-colors">NB</button>
            <button onClick={() => applyBall(1,"bye")} className="bg-[#062019] text-slate-300 border border-slate-700 hover:border-emerald-500/40 rounded-xl font-medium transition-colors">BYE</button>
            <button onClick={() => applyBall(1,"lb")} className="bg-[#062019] text-slate-300 border border-slate-700 hover:border-emerald-500/40 rounded-xl font-medium transition-colors">LB</button>
            <button onClick={handleOut} className="bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 hover:border-red-400 rounded-xl font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]">OUT</button>
            <button onClick={undo} className="bg-[#041511] text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-500 rounded-xl font-medium transition-colors">UNDO</button>
          </div>

          {/* Shot Map */}
          <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {positions.map(p => (
              <button key={p} onClick={() => setShot(p)} 
                className={`py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  shot === p 
                  ? "bg-emerald-500 text-[#010806] border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  : "bg-[#062019] text-slate-300 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* PLAYER INFO */}
        <div className="bg-gradient-to-br from-[#0a2a1f] via-[#062019] to-[#041511] p-5 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[11px] text-emerald-500/80 font-bold uppercase tracking-widest">{inning === 1 ? match.teamA.name : match.teamB.name} (Batting)</p>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <p className="text-emerald-50 font-medium text-lg flex items-center gap-2">
              {striker?.name || "-"} <span className="text-emerald-400 text-xl">*</span>
            </p>
            <p className="font-bold text-lg text-emerald-100">{striker ? getBat(striker) : ""}</p>
          </div>
          
          <div className="flex justify-between items-center mb-5 pb-5 border-b border-emerald-500/10">
            <p className="text-slate-400">{nonStriker?.name || "-"}</p>
            <p className="text-slate-400 font-medium">{nonStriker ? getBat(nonStriker) : ""}</p>
          </div>

          <p className="text-[11px] text-emerald-500/80 font-bold uppercase tracking-widest mb-3">{inning === 1 ? match.teamB.name : match.teamA.name} (Bowling)</p>
          <div className="flex justify-between items-center">
            <p className="text-emerald-50 font-medium text-lg">{bowler?.name || "-"}</p>
            <p className="font-bold text-lg text-emerald-100">{bowler ? getBowl() : ""}</p>
          </div>
        </div>

        {/* CONFIRM BUTTON */}
        <button onClick={() => applyBall(selectedRun)} 
          className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-[#010806] font-extrabold text-lg tracking-wide py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-[0.98]">
          CONFIRM BALL
        </button>
      </div>

      {/* MODALS */}
      {showBatsmanModal && (
        <div className="fixed inset-0 bg-[#010806]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#062019] p-6 rounded-2xl border border-emerald-500/30 min-w-[320px] shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            <h2 className="text-xl font-bold text-emerald-400 mb-5 text-center">
              {!striker ? "Select Striker" : !nonStriker ? "Select Non-Striker" : "Select New Batsman"}
            </h2>
            <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
              {availableBatters.filter(p => p.name !== striker?.name && p.name !== nonStriker?.name).map(p => (
                  <button key={p.name} onClick={() => selectNewBatsman(p)} 
                    className="block w-full text-left p-4 bg-[#0a2a1f] border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-500/10 rounded-xl transition-all text-emerald-50 font-medium">
                    {p.name}
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showBowlerModal && (
        <div className="fixed inset-0 bg-[#010806]/90 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-[#062019] p-6 rounded-2xl border border-emerald-500/30 min-w-[320px] shadow-[0_0_40px_rgba(16,185,129,0.1)]">
            <h2 className="text-xl font-bold text-emerald-400 mb-5 text-center">Select New Bowler</h2>
            <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
              {availableBowlers.filter(p => p.name !== bowler?.name).map(p => (
                  <button key={p.name} onClick={() => selectNewBowler(p)} 
                    className="block w-full text-left p-4 bg-[#0a2a1f] border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-500/10 rounded-xl transition-all text-emerald-50 font-medium">
                    {p.name}
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}