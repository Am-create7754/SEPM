// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from './pages/dashboardpage';
import MatchesPage from './pages/MatchesPage';
import PointsTablePage from './pages/PointsTablePage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import CreateProfilePage from './pages/CreateProfilePage';
import TeamPage from './pages/TeamPage';
import CreateTeamPage from './pages/CreateTeamPage';
import JoinTeamPage from './pages/JoinTeamPage';
import CreateTournamentPage from './pages/admin/CreateTournamentPage';
import TournamentListPage from './pages/admin/TournamentListPage';
import TournamentDetailsPage from './pages/admin/TournamentDetailsPage';
import ManageTeamPage from './pages/ManageTeamPage';
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import AdminSettings from './pages/AdminSettings';




import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
           <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
          <Route path="/tournaments" element={<ProtectedRoute><TournamentListPage /></ProtectedRoute>} />
<Route path="/admin/create-tournament" element={<ProtectedRoute><CreateTournamentPage /></ProtectedRoute>} />
          <Route path="/tournaments/:id" element={<ProtectedRoute><TournamentDetailsPage /></ProtectedRoute>} />
          <Route path="/points-table" element={<PointsTablePage />} />
   <Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <AdminPage />
    </ProtectedAdminRoute>
  }
/>      <Route path="/create-team" element={<CreateTeamPage />} />
      <Route path="/join-team" element={<JoinTeamPage />} />
      <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />



<Route path="/profile" element={<ProfilePage />} />
<Route path="/profile/create" element={<CreateProfilePage />} />
<Route path="/profile/team" element={<TeamPage />} />
<Route path="/manage-team/:id" element={<ManageTeamPage />} />



          {/* Player specific */}
          {/* <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/team" element={<TeamPage />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
