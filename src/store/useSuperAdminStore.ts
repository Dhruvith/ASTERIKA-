"use client";

import { create } from "zustand";

interface SuperAdminUser {
    username: string;
    role: string;
    exp: number;
}

interface SuperAdminState {
    isAuthenticated: boolean;
    user: SuperAdminUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    requires2FA: boolean;

    // Actions
    login: (username: string, password: string, totpCode?: string) => Promise<boolean>;
    verify: () => Promise<boolean>;
    logout: () => Promise<void>;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
    requires2FA: false,

    login: async (username: string, password: string, totpCode?: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/superadmin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, totpCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                set({
                    loading: false,
                    error: data.error || "Login failed",
                    requires2FA: false,
                });
                return false;
            }

            if (data.requires2FA && !totpCode) {
                set({ loading: false, requires2FA: true, token: data.token });
                return false;
            }

            set({
                isAuthenticated: true,
                token: data.token,
                loading: false,
                error: null,
                requires2FA: false,
            });

            // Store encrypted token in sessionStorage (NOT localStorage for security)
            if (typeof window !== "undefined") {
                sessionStorage.setItem("sa_token", data.token);
            }

            return true;
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : "Login failed",
            });
            return false;
        }
    },

    verify: async () => {
        const storedToken = typeof window !== "undefined" ? sessionStorage.getItem("sa_token") : null;
        if (!storedToken) {
            set({ isAuthenticated: false, loading: false });
            return false;
        }

        try {
            const res = await fetch("/api/superadmin/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            const data = await res.json();

            if (data.valid) {
                set({
                    isAuthenticated: true,
                    user: data.user,
                    token: storedToken,
                    loading: false,
                });
                return true;
            } else {
                sessionStorage.removeItem("sa_token");
                set({ isAuthenticated: false, user: null, token: null, loading: false });
                return false;
            }
        } catch {
            set({ isAuthenticated: false, loading: false });
            return false;
        }
    },

    logout: async () => {
        const token = get().token || sessionStorage.getItem("sa_token");
        try {
            await fetch("/api/superadmin/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch {
            // Silent fail on logout API
        }

        if (typeof window !== "undefined") {
            sessionStorage.removeItem("sa_token");
        }

        set({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
            requires2FA: false,
        });
    },

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));
