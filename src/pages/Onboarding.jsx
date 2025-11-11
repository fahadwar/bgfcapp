import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext.jsx';

const steps = [
  {
    title: 'Stay in the Pride',
    description: 'Receive personalized notifications for kickoff reminders, special offers, and club news.'
  },
  {
    title: 'Manage Tickets Anywhere',
    description: 'Add tickets to your wallet, upgrade seats, and share with friends in seconds.'
  },
  {
    title: 'Fan Zone Access',
    description: 'Unlock theme nights, pub partners, and exclusive BGFC Golden Lions experiences.'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUI();

  return (
    <div className="space-y-10 pb-16">
      <header className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-widest text-bgfc-gold">Bowling Green FC</p>
        <h1 className="text-4xl font-display font-semibold text-white">Welcome to BGFC Golden Lions</h1>
        <p className="text-sm text-white/70">
          This quick tour shows you everything you can do in the official Golden Lions hub.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="card-surface p-6">
            <h2 className="text-xl font-display font-semibold text-white">{step.title}</h2>
            <p className="mt-2 text-sm text-white/70">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            completeOnboarding();
            navigate('/auth');
          }}
          className="btn-primary px-6"
        >
          Continue to Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            completeOnboarding();
            navigate('/');
          }}
          className="btn-secondary"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
