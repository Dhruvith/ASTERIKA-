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

function applyThemeToDOM(theme: "light" | "dark") {
    if (typeof document !== "undefined") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            theme: "dark",
            sidebarCollapsed: false,
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === "light" ? "dark" : "light";
                    applyThemeToDOM(newTheme);
                    return { theme: newTheme };
                }),
            setTheme: (theme) => {
                applyThemeToDOM(theme);
                set({ theme });
            },
            toggleSidebar: () =>
                set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
        }),
        {
            name: "asterika-ui-storage",
            onRehydrateStorage: () => (state) => {
                if (state?.theme) {
                    applyThemeToDOM(state.theme);
                }
            },
        }
    )
);
