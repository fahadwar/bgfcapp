import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import {
  Squares2X2Icon,
  MegaphoneIcon,
  CalendarIcon,
  NewspaperIcon,
  TicketIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardOverview from './Overview.jsx';
import PromotionsManager from './Promotions.jsx';
import MatchesManager from './Matches.jsx';
import NewsManager from './News.jsx';
import TicketsManager from './Tickets.jsx';
import VotingManager from './Voting.jsx';

const sections = [
  { name: 'Dashboard', path: '', icon: Squares2X2Icon },
  { name: 'Promotions', path: 'promotions', icon: MegaphoneIcon },
  { name: 'Matches', path: 'matches', icon: CalendarIcon },
  { name: 'News', path: 'news', icon: NewspaperIcon },
  { name: 'Tickets Links', path: 'tickets', icon: TicketIcon },
  { name: 'Voting', path: 'voting', icon: UsersIcon }
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-white">
      <aside className="hidden w-72 flex-col border-r border-white/10 bg-black/40 px-6 py-8 lg:flex">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-bgfc-gold/70">BGFC</p>
          <h1 className="mt-2 text-2xl font-display font-semibold">Control Room</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <NavLink
                key={section.path}
                end={section.path === ''}
                to={section.path === '' ? '/admin' : `/admin/${section.path}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-bgfc-gold/20 text-bgfc-gold' : 'text-white/70 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{section.name}</span>
              </NavLink>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={signOut}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/80 transition hover:text-white hover:shadow-lg"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Sign out
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-white/10 bg-black/40 px-6 py-5 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-bgfc-gold/80">BGFC Staff Access</p>
              <h2 className="text-xl font-display font-semibold">Welcome back, {user?.displayName ?? 'Admin'}.</h2>
            </div>
            <div className="text-right text-xs text-white/60">
              <p>{user?.email ?? 'Anonymous admin'}</p>
              <p className="mt-1 rounded-full border border-bgfc-gold/30 px-3 py-1 text-[11px] uppercase tracking-widest text-bgfc-gold">Admin</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-black/40 via-[#0a0a0b] to-[#050507] px-4 py-8 sm:px-8">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="promotions" element={<PromotionsManager />} />
            <Route path="matches" element={<MatchesManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="tickets" element={<TicketsManager />} />
            <Route path="voting" element={<VotingManager />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
