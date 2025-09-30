import { create } from 'zustand';
import { User } from '@/utils/types';
import i18n from '@/lib/i18n';
import { clearAuthStorage } from '@/lib/storage/auth-storage';

type Language = 'en' | 'es';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: async () => {
    await clearAuthStorage();
    set({ user: null });
  },
  updateUser: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updates } });
    }
  },
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  language: 'en',
  setLanguage: (language) => {
    i18n.changeLanguage(language);
    set({ language });
  },
}));