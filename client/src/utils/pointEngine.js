import { getTournaments, saveTournaments } from "./storage";

export function recalculatePoints(tournamentId) {
  const tournaments = getTournaments();

  const updated = tournaments.map((t) => {
    if (String(t.id) !== String(tournamentId)) return t;

    // fresh base table
    const baseTable = t.teams.map((team) => ({
      team,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
      runsFor: 0,
      runsAgainst: 0,
      oversFaced: 0,
      oversBowled: 0,
      nrr: 0,
    }));

    // process completed matches
    t.matches
      .filter((m) => m.status === "completed")
      .forEach((match) => {
        const teamA = baseTable.find(
          (r) => r.team === match.teamA
        );
        const teamB = baseTable.find(
          (r) => r.team === match.teamB
        );

        const scoreA = match.score.teamA;
        const scoreB = match.score.teamB;

        teamA.played++;
        teamB.played++;

        teamA.runsFor += scoreA.runs;
        teamA.runsAgainst += scoreB.runs;
        teamA.oversFaced += parseFloat(scoreA.overs);
        teamA.oversBowled += parseFloat(scoreB.overs);

        teamB.runsFor += scoreB.runs;
        teamB.runsAgainst += scoreA.runs;
        teamB.oversFaced += parseFloat(scoreB.overs);
        teamB.oversBowled += parseFloat(scoreA.overs);

        if (scoreA.runs > scoreB.runs) {
          teamA.won++;
          teamB.lost++;
          teamA.points += 2;
        } else if (scoreB.runs > scoreA.runs) {
          teamB.won++;
          teamA.lost++;
          teamB.points += 2;
        } else {
          teamA.tied++;
          teamB.tied++;
          teamA.points += 1;
          teamB.points += 1;
        }
      });

    // calculate NRR
    baseTable.forEach((team) => {
      const runRateFor =
        team.oversFaced > 0
          ? team.runsFor / team.oversFaced
          : 0;

      const runRateAgainst =
        team.oversBowled > 0
          ? team.runsAgainst / team.oversBowled
          : 0;

      team.nrr = (
        runRateFor - runRateAgainst
      ).toFixed(2);
    });

    return {
      ...t,
      pointsTable: baseTable,
    };
  });

  saveTournaments(updated);
}
