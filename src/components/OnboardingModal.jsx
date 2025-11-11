import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext.jsx';

const slides = [
  {
    title: 'Welcome to the Pride',
    description: 'Stay connected with Bowling Green FC news, tickets, and matchday experiences.',
    image: '/onboarding/welcome.svg'
  },
  {
    title: 'Matchday Hub',
    description: 'Track fixtures, vote for Man of the Match, and add games to your calendar.',
    image: '/onboarding/matchday.svg'
  },
  {
    title: 'Golden Lion Rewards',
    description: 'Unlock exclusive offers, pub partners, and fan zone events tailored for you.',
    image: '/onboarding/rewards.svg'
  }
];

export default function OnboardingModal() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUI();
  const [currentSlide, setCurrentSlide] = useState(0);

  const close = (destination = '/') => {
    completeOnboarding();
    navigate(destination);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="card-surface relative w-full max-w-lg p-8">
        <button
          type="button"
          onClick={() => close()}
          className="absolute right-6 top-6 text-white/60 transition hover:text-white"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-bgfc-gold/10">
            <span className="text-3xl text-bgfc-gold">🦁</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-semibold text-white">{slides[currentSlide].title}</h2>
            <p className="text-base text-white/70">{slides[currentSlide].description}</p>
          </div>
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-8 rounded-full transition ${
                  index === currentSlide ? 'bg-bgfc-gold' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="flex w-full flex-col gap-3 md:flex-row md:justify-between">
            <button type="button" onClick={() => close()} className="btn-secondary w-full md:w-auto">
              Skip
            </button>
            {currentSlide < slides.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => prev + 1)}
                className="btn-primary w-full md:w-auto"
              >
                Next
              </button>
            ) : (
              <button type="button" onClick={() => close('/auth')} className="btn-primary w-full md:w-auto">
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
