import { themeType } from '@src/@types/theme';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export default function useTheme() {
  const isSystemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const setStoreTheme = useGlobalStore((state) => state.setCurrentTheme);

  // Retrieve the theme from localStorage on initialization
  const getInitialTheme = (): themeType => {
    const storedTheme = localStorage.getItem('theme') as themeType;
    return storedTheme ? storedTheme : isSystemDarkMode ? 'dark' : 'light';
  };

  const [currentTheme, setCurrentTheme] = useState<themeType>(() => getInitialTheme());

  const isDarkMode = currentTheme === 'dark';

  const storeTheme = (theme: themeType) => {
    localStorage.setItem('theme', theme);
  };

  const applyTheme = useCallback((theme: themeType) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme);
    storeTheme(currentTheme);
  };

  const resetToSystemTheme = () => {
    localStorage.removeItem('theme');
    const systemTheme = isSystemDarkMode ? 'dark' : 'light';
    setCurrentTheme(systemTheme);
  };

  // Apply theme on `currentTheme` change
  useEffect(() => {
    applyTheme(currentTheme);
    setStoreTheme(currentTheme);
  }, [currentTheme, applyTheme, setStoreTheme]);

  return {
    currentTheme,
    setCurrentTheme,
    resetToSystemTheme,
    isDarkMode,
    toggleTheme,
    getInitialTheme,
  };
}
