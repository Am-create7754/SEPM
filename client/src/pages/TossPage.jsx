import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getAllMatches } from "../utils/storage";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import gsap from "gsap";

export default function TossPage(){

const { matchId } = useParams();
const navigate = useNavigate();

const [match,setMatch] = useState(null);
const [flipping,setFlipping] = useState(false);
const [winner,setWinner] = useState(null);
const [decision,setDecision] = useState("");
const [result,setResult] = useState("");

const coinRef = useRef();

useEffect(()=>{

 const matches = getAllMatches();
 const m = matches.find(m => String(m.id) === matchId);
 setMatch(m);

},[matchId]);


function startToss(){

 if(flipping) return;

 setFlipping(true);

 const tl = gsap.timeline();

 tl.to(coinRef.current,{
   rotateY:1800,
   duration:2,
   ease:"power3.out"
 });

 setTimeout(()=>{

   const toss = Math.random() < 0.5 ? "Heads" : "Tails";
   setResult(toss);

   const teamWinner =
     Math.random() < 0.5 ? match.teamA : match.teamB;

   setWinner(teamWinner);

   setFlipping(false);

 },2000);

}

const ready = winner && decision;

if(!match) return null;

return(

<div className="min-h-screen w-full bg-[#010806] text-slate-100 flex flex-col">

<Navbar/>

<div className="flex flex-1 overflow-hidden">

<Sidebar/>

<main className="flex-1 px-24 py-8 overflow-y-auto">

<div className="max-w-3xl mx-auto text-center">

<h1 className="text-xl font-semibold mb-8">
Match Toss
</h1>


{/* TEAMS */}

<div className="flex justify-between mb-10">

<TeamCard name={match.teamA}/>
<TeamCard name={match.teamB}/>

</div>


{/* COIN AREA */}

<div className={`flex flex-col items-center transition-all duration-300 ${flipping ? "blur-sm" : ""}`}>

<div
ref={coinRef}
className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black text-xl font-bold shadow-xl"
>

₹

</div>

<button
onClick={startToss}
disabled={winner}
className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-black text-sm px-5 py-2 rounded-lg"
>

Virtual Toss

</button>

</div>


{/* RESULT */}

{result && (

<div className="mt-8">

<p className="text-emerald-400 font-medium">
{result}!
</p>

<p className="text-sm mt-1">
{winner} won the toss
</p>

</div>

)}


{/* BAT / BOWL */}

{winner && (

<div className="flex justify-center gap-10 mt-10">

<Choice
label="Bat"
emoji="🏏"
active={decision==="bat"}
onClick={()=>setDecision("bat")}
/>

<Choice
label="Bowl"
emoji="🎯"
active={decision==="bowl"}
onClick={()=>setDecision("bowl")}
/>

</div>

)}


{/* PLAY BUTTON */}

<button
disabled={!ready}
onClick={()=>navigate(`/match/${matchId}/players`)}
className={`w-full mt-12 py-3 rounded-lg text-sm font-medium
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



/* TEAM CARD */

function TeamCard({name}){

const initials = name
.split(" ")
.map(w=>w[0])
.join("")
.slice(0,2)
.toUpperCase();

return(

<div className="bg-black/40 border border-emerald-500/20 rounded-xl p-6 w-[45%] text-center">

<div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center text-lg font-bold mx-auto mb-2">
{initials}
</div>

<p className="text-sm text-emerald-300">
{name}
</p>

</div>

);

}


/* BAT BOWL CARD */

function Choice({label,emoji,active,onClick}){

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
{emoji}
</div>

<p className="text-sm font-medium">
{label}
</p>

</div>

);

}