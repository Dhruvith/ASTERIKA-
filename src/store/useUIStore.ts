import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
    theme: "light" | "dark";
    sidebarCollapsed: boolean;
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            theme: "dark",
            sidebarCollapsed: false,
            toggleTheme: () =>
                set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
            setTheme: (theme) => set({ theme }),
            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        }),
        {
            name: "asterika-ui-storage",
        }
    )
);
