"use client";

import { useEffect, useState, useCallback } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { User, UserPreferences, UserStats } from "@/types/user";

const googleProvider = new GoogleAuthProvider();

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: "dark",
    defaultCurrency: "USD",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    startingCapital: 10000,
};

const DEFAULT_STATS: UserStats = {
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0,
    lastUpdated: new Date(),
};

async function createUserProfile(firebaseUser: FirebaseUser): Promise<User> {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: data.displayName || firebaseUser.displayName,
            photoURL: data.photoURL || firebaseUser.photoURL,
            createdAt: data.createdAt?.toDate() || new Date(),
            preferences: data.preferences || DEFAULT_PREFERENCES,
            stats: {
                ...DEFAULT_STATS,
                ...data.stats,
                lastUpdated: data.stats?.lastUpdated?.toDate() || new Date(),
            },
        };
    }

    const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
        preferences: DEFAULT_PREFERENCES,
        stats: DEFAULT_STATS,
    };

    await setDoc(userRef, {
        ...newUser,
        createdAt: new Date(),
        stats: {
            ...DEFAULT_STATS,
            lastUpdated: new Date(),
        },
    });

    return newUser;
}

export function useAuth() {
    const { user, loading, error, setUser, setLoading, setError, reset } =
        useAuthStore();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await createUserProfile(firebaseUser);
                    setUser(userData);
                } catch (err) {
                    console.error("Error creating user profile:", err);
                    setError("Failed to load user profile");
                }
            } else {
                setUser(null);
            }
            setInitialized(true);
        });

        return () => unsubscribe();
    }, [setUser, setError]);

    const signIn = useCallback(
        async (email: string, password: string) => {
            setLoading(true);
            setError(null);
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to sign in";
                setError(message);
                throw err;
            }
        },
        [setLoading, setError]
    );

    const signUp = useCallback(
        async (email: string, password: string, displayName?: string) => {
            setLoading(true);
            setError(null);
            try {
                const { user: firebaseUser } = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                if (displayName) {
                    await updateProfile(firebaseUser, { displayName });
                }
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to create account";
                setError(message);
                throw err;
            }
        },
        [setLoading, setError]
    );

    const signInWithGoogle = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to sign in with Google";
            setError(message);
            throw err;
        }
    }, [setLoading, setError]);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await signOut(auth);
            reset();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to sign out";
            setError(message);
            throw err;
        }
    }, [setLoading, setError, reset]);

    const resetPassword = useCallback(
        async (email: string) => {
            setLoading(true);
            setError(null);
            try {
                await sendPasswordResetEmail(auth, email);
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to send password reset email";
                setError(message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setError]
    );

    return {
        user,
        loading: loading || !initialized,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        isAuthenticated: !!user,
    };
}
