import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UIContext = createContext();

const ONBOARDING_KEY = 'bgfc-onboarding-complete';

export function UIProvider({ children }) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [notificationPrompted, setNotificationPrompted] = useState(false);
  const [locationPrompted, setLocationPrompted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(ONBOARDING_KEY);
    if (stored === 'true') {
      setOnboardingComplete(true);
    }
  }, []);

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ONBOARDING_KEY, 'true');
    }
  };

  const value = useMemo(
    () => ({
      onboardingComplete,
      completeOnboarding,
      notificationPrompted,
      setNotificationPrompted,
      locationPrompted,
      setLocationPrompted
    }),
    [onboardingComplete, notificationPrompted, locationPrompted]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
