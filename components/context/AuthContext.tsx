"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/types";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase.client";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<void>;
  googleLogin: () => Promise<void>;
  updateAvatar: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyInit = () => {
    if (!auth || !db) {
      console.error("Firebase not initialized correctly.");
      throw new Error("Authentication service is currently unavailable.");
    }
  };

  /**
   * Synchronizes Firebase Auth user with Firestore user document.
   */
  const syncUser = async (firebaseUser: FirebaseUser, displayName?: string) => {
    if (!db) return null;

    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        const fullySyncUser = { ...userData, id: firebaseUser.uid };
        setCurrentUser(fullySyncUser);
        return fullySyncUser;
      } else {
        // First time setup - create document
        const newUser: User = {
          id: firebaseUser.uid,
          name: displayName || firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          role: "Member",
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, {
          ...newUser,
          createdAt: serverTimestamp()
        });
        setCurrentUser(newUser);
        return newUser;
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error("Critical: Firestore permission denied for authenticated user. UID:", firebaseUser.uid);
        setCurrentUser(null);
        return null;
      }

      console.error("Error syncing user with Firestore:", {
        code: error.code,
        message: error.message,
        uid: firebaseUser.uid
      });

      // Fallback for non-permission errors (e.g. offline)
      const fallbackUser: User = {
        id: firebaseUser.uid,
        name: displayName || firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        role: "Member",
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(fallbackUser);
      return fallbackUser;
    }
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Small delay to ensure Firestore SDK has the token ready
          // await new Promise(resolve => setTimeout(resolve, 50)); 
          const syncedUser = await syncUser(user);
          if (!syncedUser) {
            console.warn("User authenticated but Firestore sync returned null.");
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    verifyInit();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const googleLogin = async (): Promise<void> => {
    verifyInit();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    verifyInit();
    try {
      await signOut(auth);
      setCurrentUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "Member",
  ): Promise<void> => {
    verifyInit();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Fire and forget the sync; the onAuthStateChanged listener will also trigger syncUser
      syncUser(userCredential.user, name).catch((err) =>
        console.error("Background sync error:", err),
      );
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const updateAvatar = async (url: string) => {
    verifyInit();
    if (!currentUser?.id || !db) return;

    try {
      const userRef = doc(db, "users", currentUser.id);
      await setDoc(userRef, { avatarUrl: url }, { merge: true });
      setCurrentUser(prev => prev ? { ...prev, avatarUrl: url } : null);
    } catch (error) {
      console.error("Update avatar failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        register,
        googleLogin,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
