import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UIContext = createContext();

const ONBOARDING_KEY = 'bgfc-onboarding-complete';

export function UIProvider({ children }) {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [notificationPrompted, setNotificationPrompted] = useState(false);
  const [locationPrompted, setLocationPrompted] = useState(false);
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), toast.duration ?? 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = (message, variant = 'success', duration = 4000) => {
    setToast({ id: Date.now(), message, variant, duration });
  };

  const hideToast = () => setToast(null);

  const value = useMemo(
    () => ({
      onboardingComplete,
      completeOnboarding,
      notificationPrompted,
      setNotificationPrompted,
      locationPrompted,
      setLocationPrompted,
      toast,
      showToast,
      hideToast
    }),
    [onboardingComplete, notificationPrompted, locationPrompted, toast]
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
