import { typePostGenre, typePostGenreItem } from '@src/@types/typePostItem';
import { user_profile } from '@src/@types/typeRequest';
import allGenreList from '@src/constants/genreList';
import { create } from 'zustand';

// Zustand store
interface GlobalStore {
  currentGenreItem: typePostGenreItem;
  currentPostGenre: typePostGenre;
  setCurrentPostType: (type: typePostGenre) => void;
  isDarkMode: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  setUserInfo: (user: user_profile | null) => void;
  userChecking: boolean;
  setUserChecking: (checking: boolean) => void;
  userInfo?: user_profile | null;
  userDisplayName?: string;
  currentSearchWord?: string;
  setCurrentSearchWord: (word: string) => void;
}

const defaultGenre = allGenreList[0];

const useGlobalStore = create<GlobalStore>((set) => {
  return {
    currentGenreItem: defaultGenre,
    currentPostGenre: defaultGenre['name'],
    setCurrentPostType: (name: typePostGenre) =>
      set({ currentPostGenre: name, currentGenreItem: allGenreList.find((f) => f.name === name) }),
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
    currentSearchWord: '',
    setCurrentSearchWord: (word) => {
      set({
        currentSearchWord: word,
      });
    },
    userChecking: true,
    setUserChecking: (b) => set({ userChecking: b }),
  };
});

export default useGlobalStore;
