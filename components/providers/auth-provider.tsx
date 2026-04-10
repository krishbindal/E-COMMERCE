"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getClientAuth, getGoogleProvider } from "@/lib/firebase-client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getClientAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginWithGoogle: async () => {
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase auth is not configured");
        await signInWithPopup(auth, getGoogleProvider());
      },
      loginWithEmail: async (email, password) => {
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase auth is not configured");
        await signInWithEmailAndPassword(auth, email, password);
      },
      signupWithEmail: async (email, password) => {
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase auth is not configured");
        await createUserWithEmailAndPassword(auth, email, password);
      },
      logout: async () => {
        const auth = getClientAuth();
        if (!auth) return;
        await signOut(auth);
      },
      getIdToken: async () => {
        const auth = getClientAuth();
        return auth?.currentUser ? auth.currentUser.getIdToken() : null;
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
