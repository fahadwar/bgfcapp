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

  useEffect(() => {
    if (!auth) {
      setUser(guestUser);
      setInitialising(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? guestUser);
      setInitialising(false);
    });

    return () => unsubscribe?.();
  }, []);

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
      return guestUser;
    }
    const credential = await signInAnonymously(auth);
    if (credential?.user) {
      setUser(credential.user);
      return credential.user;
    }
    return guestUser;
  };

  const signOut = async () => {
    if (!auth) {
      setUser(guestUser);
      return;
    }
    await firebaseSignOut(auth);
    setUser(guestUser);
  };

  const value = useMemo(
    () => ({
      user,
      loading: initialising,
      error,
      signInWithGoogle: signInWithGoogleProvider,
      signInWithFacebook: signInWithFacebookProvider,
      signInWithEmail,
      createEmailAccount,
      continueAsGuest,
      signOut,
      hasFirebaseConfig
    }),
    [user, initialising, error]
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
