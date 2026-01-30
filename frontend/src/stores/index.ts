import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

interface ThemeState {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'system',
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'theme-storage',
        }
    )
);

interface SearchState {
    query: string;
    filters: {
        cycleId?: string;
        fieldId?: string;
        institutionId?: string;
        academicYear?: string;
        language?: string;
    };
    setQuery: (query: string) => void;
    setFilter: (key: string, value: string | undefined) => void;
    clearFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    query: '',
    filters: {},
    setQuery: (query) => set({ query }),
    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),
    clearFilters: () => set({ filters: {} }),
}));
