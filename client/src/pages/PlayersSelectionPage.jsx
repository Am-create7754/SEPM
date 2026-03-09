import { useParams } from "react-router-dom";
import { getAllMatches } from "../utils/storage";
import { useEffect, useState } from "react";import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import PlayerSelectorModal from "../components/PlayerSelectorModal";

export default function PlayerSelectionPage() {

  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [bowler, setBowler] = useState(null);

  const [modalType, setModalType] = useState(null);

  const { matchId } = useParams();

const [teamA, setTeamA] = useState(null);
const [teamB, setTeamB] = useState(null);

const battingPlayers = teamA?.members || []
const bowlingPlayers = teamB?.members || []

  const allSelected = striker && nonStriker && bowler;

  useEffect(() => {

  const matches = getAllMatches();

  const match = matches.find(
    m => String(m.id) === matchId
  );

  if(match){
    setTeamA(match.teamA);
    setTeamB(match.teamB);
  }

}, [matchId]);

if (!teamA || !teamB) {
  return (
    <div className="text-white p-10">
      Loading players...
    </div>
  )
}
  return (
    <div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-24 py-8 overflow-y-auto">

          <h1 className="text-xl font-semibold mb-6">
            Select Opening Players
          </h1>

          {/* Batting */}
          <h2 className="text-lg mb-3">
            Batting - {teamA.name}
          </h2>

          <div className="flex gap-4 mb-8">

            <button
              onClick={() => setModalType("striker")}
              className="p-6 border border-emerald-500/20 rounded-md hover:bg-emerald-500/10"
            >
              {striker ? striker.name : "Select Striker"}
            </button>

            <button
              onClick={() => setModalType("nonStriker")}
              className="p-6 border border-emerald-500/20 rounded-md hover:bg-emerald-500/10"
            >
              {nonStriker ? nonStriker.name : "Select Non-Striker"}
            </button>

          </div>

          {/* Bowling */}
          <h2 className="text-lg mb-3">
            Bowling - {teamB.name}
          </h2>

          <button
            onClick={() => setModalType("bowler")}
            className="p-6 border border-emerald-500/20 rounded-md hover:bg-emerald-500/10 mb-10"
          >
            {bowler ? bowler.name : "Select Bowler"}
          </button>

          {/* Start Button */}
          <div>
            <button
              disabled={!allSelected}
              className={`px-8 py-3 rounded-md font-medium ${
                allSelected
                  ? "bg-emerald-500 text-black"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              START SCORING
            </button>
          </div>

        </main>
      </div>

      {/* MODALS */}

      {modalType === "striker" && (
        <PlayerSelectorModal
          players={battingPlayers}
          exclude={[nonStriker?.name]}
          onSelect={setStriker}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === "nonStriker" && (
        <PlayerSelectorModal
          players={battingPlayers}
          exclude={[striker?.name]}
          onSelect={setNonStriker}
          onClose={() => setModalType(null)}
        />
      )}

      {modalType === "bowler" && (
        <PlayerSelectorModal
          players={bowlingPlayers}
          exclude={[striker?.name, nonStriker?.name]}
          onSelect={setBowler}
          onClose={() => setModalType(null)}
        />
      )}

    </div>
  );
}