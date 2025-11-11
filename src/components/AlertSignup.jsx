import { useState } from 'react';
import { requestNotificationPermission } from '../services/notificationService.js';

export default function AlertSignup() {
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async () => {
    setStatus('loading');
    const response = await requestNotificationPermission();
    setStatus(response.granted ? 'success' : 'error');
  };

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-white">Sign up for alerts</h3>
          <p className="text-sm text-white/70">Get match reminders, merch drops, and community events.</p>
        </div>
        <button type="button" onClick={handleSubscribe} className="btn-primary mt-4 w-full md:mt-0 md:w-auto">
          {status === 'loading' ? 'Subscribing...' : 'Enable Alerts'}
        </button>
      </div>
      {status === 'success' && <p className="mt-3 text-sm text-bgfc-gold">Notifications enabled! We will keep you in the loop.</p>}
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-400">We could not enable notifications. Please allow them in your browser settings.</p>
      )}
    </div>
  );
}
