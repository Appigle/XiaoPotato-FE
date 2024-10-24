import { ArtItemType, ArtNameType } from '@src/@types/artTypes';
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
  };
});

export default useGlobalStore;
