import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInAnonymously,
  firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  hasFirebaseConfig
} from '../services/firebase.js';

const AuthContext = createContext();

const ADMIN_CACHE_KEY = 'bgfc-admin-flag';
const guestUser = {
  uid: 'guest-user',
  displayName: 'Guest Supporter',
  email: null,
  isAnonymous: true
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const devBypass = import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true';
  const adminEmailList = useMemo(() => {
    const raw = import.meta.env.VITE_ADMIN_EMAILS ?? '';
    return raw
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const persistAdminFlag = (flag, uid) => {
    try {
      if (typeof window === 'undefined') return;
      if (!flag) {
        window.localStorage.removeItem(ADMIN_CACHE_KEY);
      } else {
        window.localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify({ flag, uid }));
      }
    } catch (storageError) {
      console.warn('Unable to persist admin flag', storageError);
    }
  };

  const hydrateAdminFlag = () => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(ADMIN_CACHE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (storageError) {
      console.warn('Unable to read admin cache', storageError);
      return null;
    }
  };

  useEffect(() => {
    if (!auth) {
      setUser(guestUser);
      setIsAdmin(devBypass);
      setAdminLoading(false);
      setInitialising(false);
      return;
    }

    const cached = hydrateAdminFlag();
    if (cached?.flag) {
      setIsAdmin(true);
      setAdminLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ?? guestUser);
      await evaluateAdmin(firebaseUser ?? guestUser);
      setInitialising(false);
    });

    return () => unsubscribe?.();
  }, []);

  const evaluateAdmin = async (candidate) => {
    try {
      setAdminLoading(true);
      if (devBypass) {
        setIsAdmin(true);
        persistAdminFlag(true, candidate?.uid ?? 'dev');
        return true;
      }

      if (!candidate || candidate.uid === guestUser.uid) {
        setIsAdmin(false);
        persistAdminFlag(false);
        return false;
      }

      if (!hasFirebaseConfig) {
        const fallbackAdmin = candidate.email
          ? adminEmailList.includes(candidate.email.toLowerCase())
          : false;
        setIsAdmin(fallbackAdmin);
        persistAdminFlag(fallbackAdmin, candidate.uid);
        return fallbackAdmin;
      }

      const tokenResult = await candidate.getIdTokenResult(true);
      const hasClaim = tokenResult?.claims?.admin === true;
      const fallbackAdmin = candidate.email
        ? adminEmailList.includes(candidate.email.toLowerCase())
        : false;
      const resolved = hasClaim || fallbackAdmin;
      setIsAdmin(resolved);
      persistAdminFlag(resolved, candidate.uid);
      return resolved;
    } catch (adminError) {
      console.error('Unable to resolve admin privileges', adminError);
      setIsAdmin(false);
      persistAdminFlag(false);
      return false;
    } finally {
      setAdminLoading(false);
    }
  };

  const runAuthAction = async (callback, fallbackUser = guestUser) => {
    try {
      setError(null);
      if (!auth) {
        setUser(fallbackUser);
        return fallbackUser;
      }
      const credential = await callback();
      if (credential?.user) {
        setUser(credential.user);
        await evaluateAdmin(credential.user);
        return credential.user;
      }
      return null;
    } catch (err) {
      console.error('Authentication error', err);
      setError(err);
      throw err;
    }
  };

  const signInWithGoogleProvider = () =>
    runAuthAction(() => signInWithPopup(auth, new GoogleAuthProvider()), {
      ...guestUser,
      displayName: 'Guest via Google'
    });

  const signInWithFacebookProvider = () =>
    runAuthAction(() => signInWithPopup(auth, new FacebookAuthProvider()), {
      ...guestUser,
      displayName: 'Guest via Facebook'
    });

  const signInWithEmail = async (email, password, displayName) =>
    runAuthAction(async () => {
      if (!auth) {
        return { user: { ...guestUser, displayName: displayName ?? 'Guest Supporter', email } };
      }
      const { user: emailUser } = await signInWithEmailAndPassword(auth, email, password);
      if (displayName && !emailUser.displayName) {
        await updateProfile(emailUser, { displayName });
      }
      return { user: emailUser };
    });

  const createEmailAccount = async (email, password, displayName) =>
    runAuthAction(async () => {
      if (!auth) {
        return { user: { ...guestUser, displayName: displayName ?? 'Guest Supporter', email } };
      }
      const { user: createdUser } = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(createdUser, { displayName });
      }
      return { user: createdUser };
    });

  const continueAsGuest = async () => {
    if (!auth) {
      setUser(guestUser);
      setIsAdmin(devBypass);
      return guestUser;
    }
    const credential = await signInAnonymously(auth);
    if (credential?.user) {
      setUser(credential.user);
      await evaluateAdmin(credential.user);
      return credential.user;
    }
    return guestUser;
  };

  const signOut = async () => {
    if (!auth) {
      setUser(guestUser);
      setIsAdmin(devBypass);
      return;
    }
    await firebaseSignOut(auth);
    setUser(guestUser);
    setIsAdmin(devBypass);
    persistAdminFlag(false);
  };

  const refreshAdminStatus = () => evaluateAdmin(user);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      adminLoading,
      loading: initialising,
      error,
      signInWithGoogle: signInWithGoogleProvider,
      signInWithFacebook: signInWithFacebookProvider,
      signInWithEmail,
      createEmailAccount,
      continueAsGuest,
      signOut,
      hasFirebaseConfig,
      refreshAdminStatus
    }),
    [
      user,
      isAdmin,
      adminLoading,
      initialising,
      error,
      devBypass,
      adminEmailList
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
