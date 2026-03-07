export function isSuperAdmin(user) {
  return user?.role === "superadmin";
}

export function isOrganiser(user) {
  return user?.role === "organiser";
}

export function isTournamentOwner(user, tournament) {
  return (
    user?.role === "organiser" &&
    tournament?.createdBy === user?.id
  );
}
