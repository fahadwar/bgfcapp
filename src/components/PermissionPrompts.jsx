import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { requestNotificationPermission } from '../services/notificationService.js';
import { requestLocationPermission } from '../services/locationService.js';

export default function PermissionPrompts() {
  const { user } = useAuth();
  const { notificationPrompted, setNotificationPrompted, locationPrompted, setLocationPrompted } = useUI();
  const [notificationStatus, setNotificationStatus] = useState('pending');
  const [locationStatus, setLocationStatus] = useState('pending');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (notificationPrompted || typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      setNotificationPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notificationPrompted, setNotificationPrompted]);

  useEffect(() => {
    if (locationPrompted || typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      setLocationPrompted(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, [locationPrompted, setLocationPrompted]);

  const handleNotificationRequest = async () => {
    const response = await requestNotificationPermission();
    setNotificationStatus(response.granted ? 'granted' : 'denied');
  };

  const handleLocationRequest = async () => {
    const response = await requestLocationPermission();
    setLocationStatus(response.granted ? 'granted' : 'denied');
  };

  if ((!notificationPrompted && !locationPrompted) || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-28 md:pb-8">
      <div className="card-surface w-full max-w-xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-display font-semibold text-white">Stay connected, {user?.displayName ?? 'Supporter'}</h3>
            <p className="mt-1 text-sm text-white/70">
              Enable notifications and location to get personalized alerts, match reminders, and pub partner tips near you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-full bg-white/5 px-2 py-1 text-sm text-white/50 transition hover:text-white"
          >
            Dismiss
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Match & news alerts</p>
            <p className="mt-1 text-xs text-white/60">Never miss a kickoff, promo, or score update.</p>
            <button type="button" onClick={handleNotificationRequest} className="btn-primary mt-4 w-full">
              {notificationStatus === 'pending'
                ? 'Enable Notifications'
                : notificationStatus === 'granted'
                ? 'Notifications Enabled'
                : 'Permission Denied'}
            </button>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Nearby events & pubs</p>
            <p className="mt-1 text-xs text-white/60">Find viewing parties and partner deals close to you.</p>
            <button type="button" onClick={handleLocationRequest} className="btn-secondary mt-4 w-full">
              {locationStatus === 'pending'
                ? 'Share Location'
                : locationStatus === 'granted'
                ? 'Location Enabled'
                : 'Permission Denied'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
