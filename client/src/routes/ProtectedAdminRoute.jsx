import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedAdminRoute({ children }) {
  const user = getUser();

  const isAdmin =
    user?.role === "organiser" ||
    user?.role === "superadmin";

  if (!isAdmin) {
    return <Navigate to="/profile"/>;
  }

  return children;
}
