// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { darkTheme, lightTheme } from '../styles/theme';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('blip-theme');
    return saved ? saved === 'dark' : true;
  });

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('blip-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Inject CSS variables into :root so they're available everywhere
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      // convert camelCase to --kebab-case
      const cssVar = '--' + key.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());
      root.style.setProperty(cssVar, value);
    });

    document.body.style.background = theme.bgApp;
    document.body.style.color = theme.textPrimary;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
