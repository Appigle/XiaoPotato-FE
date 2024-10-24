import { ArtItemType, ArtNameType } from '@src/@types/artTypes';
import { user_profile } from '@src/@types/request/XPotato';
import ALL_ART_TYPES from '@src/constants/ArtTypes';
import { create } from 'zustand';

// Zustand store
interface GlobalStore {
  currentArtItem: ArtItemType;
  currentArtType: ArtNameType;
  setCurrentArtType: (type: ArtNameType) => void;
  isDarkMode: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  setUserInfo: (user: user_profile | null) => void;
  userInfo?: user_profile | null;
  userDisplayName?: string;
}

const defaultArt = ALL_ART_TYPES[0];

const useGlobalStore = create<GlobalStore>((set) => {
  return {
    currentArtItem: defaultArt,
    currentArtType: defaultArt['name'],
    setCurrentArtType: (name: ArtNameType) =>
      set({ currentArtType: name, currentArtItem: ALL_ART_TYPES.find((f) => f.name === name) }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    isDarkMode: true,
    currentTheme: 'dark',
    setCurrentTheme: (sTheme) => set({ currentTheme: sTheme, isDarkMode: sTheme === 'dark' }),
    setUserInfo: (user) =>
      set({
        userInfo: user,
        userDisplayName: `${user?.firstName || ''} ${((user?.lastName || '')[0] || '').toUpperCase()}.`,
      }),
    userInfo: null,
    userDisplayName: '',
  };
});

export default useGlobalStore;
