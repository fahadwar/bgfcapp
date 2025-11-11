import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth() {
  const navigate = useNavigate();
  const {
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    createEmailAccount,
    continueAsGuest,
    loading,
    error
  } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [status, setStatus] = useState('idle');

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus('loading');
      if (mode === 'signin') {
        await signInWithEmail(form.email, form.password);
      } else {
        await createEmailAccount(form.email, form.password, form.displayName);
      }
      setStatus('success');
      navigate('/');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleProvider = async (providerFn) => {
    try {
      setStatus('loading');
      await providerFn();
      setStatus('success');
      navigate('/');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pb-10">
      <div className="card-surface w-full max-w-2xl space-y-6 p-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-bgfc-gold">Bowling Green FC</p>
          <h1 className="mt-1 text-3xl font-display font-semibold text-white">Sign in or create account</h1>
          <p className="mt-2 text-sm text-white/70">Access tickets, vote, and personalize your Golden Lions experience.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleProvider(signInWithGoogle)}
            className="btn-secondary w-full"
            disabled={status === 'loading'}
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleProvider(signInWithFacebook)}
            className="btn-secondary w-full"
            disabled={status === 'loading'}
          >
            Continue with Facebook
          </button>
        </div>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-white">Display name</label>
              <input
                type="text"
                required
                value={form.displayName}
                onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-bgfc-gold/60 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-white">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-bgfc-gold/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-bgfc-gold/60 focus:outline-none"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={status === 'loading'}>
            {mode === 'signin' ? 'Sign in with Email' : 'Create Account'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
          className="text-sm text-bgfc-gold"
        >
          {mode === 'signin' ? "Need an account? Create one" : 'Have an account? Sign in'}
        </button>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-sm text-white/70">Just exploring?</p>
          <button type="button" onClick={() => handleProvider(continueAsGuest)} className="btn-secondary">
            Continue as guest
          </button>
        </div>
        {(error || status === 'error') && (
          <p className="text-center text-sm text-red-400">We hit a snag signing you in. Please try again.</p>
        )}
        {loading && <p className="text-center text-sm text-white/60">Checking your session…</p>}
      </div>
    </div>
  );
}
