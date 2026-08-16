import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../services/firebase";
import type { AppUser, UserRole } from "../types/user";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function buildAppUser(firebaseUser: FirebaseUser): Promise<AppUser> {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  let role: UserRole = "customer";

  if (userDocSnap.exists()) {
    role = userDocSnap.data().role as UserRole;
  } else {
    // Primera vez que este usuario inicia sesión: lo creamos como customer
    await setDoc(userDocRef, {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName ?? "",
      role: "customer",
    });
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await buildAppUser(firebaseUser);
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function register(email: string, password: string, displayName: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", credential.user.uid), {
      email,
      displayName,
      role: "customer",
    });
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  async function logout() {
    await signOut(auth);
  }

  const value: AuthContextType = {
    currentUser,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}