import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, defaultTheme } from '../config/theme.config';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(currentTheme));
    document.documentElement.style.setProperty('--primary', currentTheme.colors.primary);
    document.documentElement.style.setProperty('--secondary', currentTheme.colors.secondary);
    document.documentElement.style.setProperty('--accent', currentTheme.colors.accent);
    document.documentElement.style.setProperty('--background', currentTheme.colors.background);
    document.documentElement.style.setProperty('--foreground', currentTheme.colors.foreground);
    document.documentElement.style.setProperty('--gradient-start', currentTheme.colors.gradient.start);
    document.documentElement.style.setProperty('--gradient-middle', currentTheme.colors.gradient.middle);
    document.documentElement.style.setProperty('--gradient-end', currentTheme.colors.gradient.end);
    document.documentElement.style.setProperty('--gradient-accent', currentTheme.colors.gradient.accent);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 