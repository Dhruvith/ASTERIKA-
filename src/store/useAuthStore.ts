import { create } from "zustand";
import { User } from "@/types/user";

interface AuthStore {
    user: User | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,
    error: null,
    setUser: (user) => set({ user, loading: false, error: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),
    reset: () => set({ user: null, loading: false, error: null }),
}));
