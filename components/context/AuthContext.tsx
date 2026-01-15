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
    User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase.client";

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
    googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        if (!db) return;

        try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data() as User;
                setCurrentUser({ ...userData, id: firebaseUser.uid });
            } else {
                // First time setup - create document
                const newUser: User = {
                    id: firebaseUser.uid,
                    name: displayName || firebaseUser.displayName || "User",
                    email: firebaseUser.email || "",
                    role: "Member",
                    createdAt: new Date().toISOString()
                };

                await setDoc(userRef, newUser);
                setCurrentUser(newUser);
            }
        } catch (error: any) {
            console.error("Error syncing user with Firestore:", error);

            // If it's the "offline" error, we still allow local state if we have enough info
            if (error.code === 'unavailable' || error.message?.includes('offline')) {
                setCurrentUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || "User",
                    email: firebaseUser.email || "",
                    role: "Member", // Fallback
                    createdAt: new Date().toISOString()
                });
            }
        }
    };

    useEffect(() => {
        if (!auth) {
            setIsLoading(false);
            return;
        }

        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                // DON'T await syncUser here; it updates currentUser internally efficiently.
                // This prevents a hanging Firestore getDoc/setDoc from blocking the entire UI mount.
                syncUser(user).finally(() => {
                    setIsLoading(false);
                });
            } else {
                setCurrentUser(null);
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

    const register = async (name: string, email: string, password: string, _role: UserRole = "Member"): Promise<void> => {
        verifyInit();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Fire and forget the sync; the onAuthStateChanged listener will also trigger syncUser
            syncUser(userCredential.user, name).catch(err => console.error("Background sync error:", err));
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated: !!currentUser,
            isLoading,
            login,
            logout,
            register,
            googleLogin
        }}>
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