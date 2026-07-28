'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ColorTheme = 'default' | 'baby-blue' | 'bubblegum-pink' | 'hot-pink' | 'thanos-purple' | 'gun-metal' | 'rainbow';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const handleSetColorTheme = useCallback((theme: ColorTheme) => {
    setColorTheme(theme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colorTheme, setColorTheme: handleSetColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
