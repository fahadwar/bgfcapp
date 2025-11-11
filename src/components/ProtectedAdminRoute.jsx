import { Navigate, useLocation } from 'react-router-dom';
import LoadingState from './LoadingState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ForbiddenScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bgfc-charcoal px-6 py-12 text-center text-white">
      <div className="max-w-lg space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bgfc-gold/80">403 Forbidden</p>
        <h1 className="text-3xl font-display font-semibold">You don&apos;t have access to the BGFC control room.</h1>
        <p className="text-base text-white/70">
          This area is reserved for Golden Lions staff. If you believe this is a mistake, please contact the
          BGFC digital team to request admin access.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-bgfc-gold px-6 py-3 text-sm font-semibold text-bgfc-charcoal shadow-lg transition hover:bg-bgfc-gold/80"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

export default function ProtectedAdminRoute({ children }) {
  const { user, loading, adminLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading || adminLoading) {
    return <LoadingState label="Checking access" />;
  }

  const isAuthenticated = user && user.uid !== 'guest-user';

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <ForbiddenScreen />;
  }

  return children;
}
