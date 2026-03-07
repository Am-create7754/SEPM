// src/Sidebar.jsx
import {
  Home,
  Trophy,
  Calendar,
  List,
  Shield,
  User,
  UserPlus,
  Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../utils/auth';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const isProfileActive = location.pathname.startsWith('/profile');

  const isAdmin =
    user?.role === 'organiser' ||
    user?.role === 'superadmin';

  // 🔥 Items defined INSIDE component so we can filter
  const items = [
    { label: 'Dashboard', icon: <Home size={14} />, path: '/' },
    { label: 'Tournaments', icon: <Trophy size={14} />, path: '/tournaments' },
    { label: 'Matches', icon: <Calendar size={14} />, path: '/matches' },
    { label: 'Points Table', icon: <List size={14} />, path: '/points-table' },
    ...(isAdmin
      ? [{ label: 'Admin', icon: <Shield size={14} />, path: '/admin' }]
      : []),
  ];

  return (
    <aside
      className="
        hidden md:flex w-52 flex-col justify-between
        bg-gradient-to-b
        from-[#051510]
        via-[#051510]
        to-[#041511]
        border-r border-emerald-500/20
      "
    >
      {/* Navigation */}
      <nav className="mt-4 px-3 space-y-1">

        {/* Main items */}
        {items.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all
                ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-200'
                    : 'text-slate-400 hover:bg-emerald-500/10 hover:text-slate-200'
                }
              `}
            >
              <span
                className={`
                  w-5 h-5 flex items-center justify-center rounded-md
                  bg-black/40 border border-slate-700
                  ${active ? 'text-emerald-400' : 'text-slate-400'}
                `}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Profile Parent */}
        <button
          onClick={() => navigate('/profile')}
          className={`
            mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all
            ${
              isProfileActive
                ? 'bg-emerald-500/15 text-emerald-200'
                : 'text-slate-400 hover:bg-emerald-500/10 hover:text-slate-200'
            }
          `}
        >
          <span
            className={`
              w-5 h-5 flex items-center justify-center rounded-md
              bg-black/40 border border-slate-700
              ${isProfileActive ? 'text-emerald-400' : 'text-slate-400'}
            `}
          >
            <User size={14} />
          </span>

          <span>Profile</span>
        </button>

        {/* Profile Sub Menu */}
        <div className="ml-6 mt-1 space-y-1">

          <button
            onClick={() => navigate('/profile/create')}
            className={`
              w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] transition-all
              ${
                location.pathname === '/profile/create'
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'text-slate-500 hover:bg-emerald-500/10 hover:text-slate-300'
              }
            `}
          >
            <UserPlus size={12} />
            Create Profile
          </button>

          <button
            onClick={() => navigate('/profile/team')}
            className={`
              w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] transition-all
              ${
                location.pathname === '/profile/team'
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'text-slate-500 hover:bg-emerald-500/10 hover:text-slate-300'
              }
            `}
          >
            <Users size={12} />
            My Team
          </button>

        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <div className="px-3 py-3 rounded-lg bg-black/40 border border-emerald-500/20">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
            SEPM Project
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Software Engineering Project Management course demo.
          </p>
        </div>
      </div>
    </aside>
  );
}
