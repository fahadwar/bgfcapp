import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import OnboardingModal from './OnboardingModal.jsx';
import PermissionPrompts from './PermissionPrompts.jsx';

const navigation = [
  { name: 'Home', href: '/', icon: 'home' },
  { name: 'Fan Zone', href: '/fan-zone', icon: 'sparkles' },
  { name: 'Tickets', href: '/tickets', icon: 'ticket' },
  { name: 'Schedule', href: '/schedule', icon: 'calendar' }
];

function navIcon(name) {
  const className = 'h-6 w-6';
  switch (name) {
    case 'sparkles':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 3.75 8.25 8.25 3.75 9.75l4.5 1.5 1.5 4.5 1.5-4.5 4.5-1.5-4.5-1.5-1.5-4.5zm9 2.25-.75 2.25L15.75 9l2.25.75.75 2.25.75-2.25L21.75 9l-2.25-.75-.75-2.25zm-3 7.5-.75 2.25L12.75 18l2.25.75.75 2.25.75-2.25L18.75 18l-2.25-.75-.75-2.25z"
          />
        </svg>
      );
    case 'ticket':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25v-10.5m2.25-3h-12a1.5 1.5 0 0 0-1.5 1.5v2.1a2.4 2.4 0 0 1 0 4.8v2.1a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.1a2.4 2.4 0 0 1 0-4.8v-2.1a1.5 1.5 0 0 0-1.5-1.5z"
          />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v11.25m-18 0A1.5 1.5 0 0 0 4.5 20.25h15a1.5 1.5 0 0 0 1.5-1.5m-18 0V12a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 12v6.75"
          />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9.75A6.75 6.75 0 0 1 9.75 3h4.5A6.75 6.75 0 0 1 21 9.75v4.5A6.75 6.75 0 0 1 14.25 21h-4.5A6.75 6.75 0 0 1 3 14.25v-4.5z"
          />
        </svg>
      );
  }
}

export default function Layout({ children }) {
  const { user } = useAuth();
  const { onboardingComplete } = useUI();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bgfc-gradient">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-bgfc-charcoal/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bgfc-gold/10">
              <span className="text-xl font-display font-semibold text-bgfc-gold">BG</span>
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-white/60">Bowling Green FC</p>
              <p className="text-lg font-display font-semibold">Golden Lions</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-bgfc-gold/20 text-bgfc-gold' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                {navIcon(item.icon)}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-white/70">{user?.displayName ?? 'Guest Supporter'}</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center rounded-full border border-white/10 p-2 text-white md:hidden"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/5 bg-bgfc-charcoal/95 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive ? 'bg-bgfc-gold/20 text-bgfc-gold' : 'text-white/80 hover:bg-white/5'
                    }`
                  }
                >
                  <span>{item.name}</span>
                  {navIcon(item.icon)}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto flex max-w-6xl flex-1 flex-col px-4 pb-24 pt-6 md:px-6">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-bgfc-charcoal/90 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-6 py-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink key={item.name} to={item.href} className="flex flex-col items-center gap-1 text-xs font-medium">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    isActive ? 'bg-bgfc-gold/20 text-bgfc-gold' : 'text-white/70'
                  }`}
                >
                  {navIcon(item.icon)}
                </span>
                <span className={isActive ? 'text-bgfc-gold' : 'text-white/60'}>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
      {!onboardingComplete && <OnboardingModal />}
      <PermissionPrompts />
    </div>
  );
}
