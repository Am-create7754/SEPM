const TEAMS_KEY = "teams";
const TOURNAMENTS_KEY = "tournaments";

// Teams
export function getTeams() {
  return JSON.parse(localStorage.getItem(TEAMS_KEY)) || [];
}

export function saveTeams(teams) {
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
}

// Tournaments
export function getTournaments() {
  return JSON.parse(localStorage.getItem(TOURNAMENTS_KEY)) || [];
}

export function saveTournaments(tournaments) {
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));
}

// ===== GLOBAL MATCH STORAGE =====

export function getAllMatches() {
  return JSON.parse(localStorage.getItem("allMatches")) || [];
}

export function saveAllMatches(matches) {
  localStorage.setItem("allMatches", JSON.stringify(matches));
}
