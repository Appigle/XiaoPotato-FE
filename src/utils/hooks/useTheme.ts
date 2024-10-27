import { typeTheme } from '@src/@types/typeTheme';
import useGlobalStore from '@src/stores/useGlobalStore';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export default function useTheme() {
  const isSystemDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const setStoreTheme = useGlobalStore((state) => state.setCurrentTheme);

  // Retrieve the theme from localStorage on initialization
  const getInitialTheme = (): typeTheme => {
    const storedTheme = localStorage.getItem('theme') as typeTheme;
    return storedTheme ? storedTheme : isSystemDarkMode ? 'dark' : 'light';
  };

  const [currentTheme, setCurrentTheme] = useState<typeTheme>(() => getInitialTheme());

  const isDarkMode = currentTheme === 'dark';

  const storeTheme = (theme: typeTheme) => {
    localStorage.setItem('theme', theme);
  };

  const applyTheme = useCallback((theme: typeTheme) => {
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
