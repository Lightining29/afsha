import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();

      // Apply theme colors to CSS variables
      document.documentElement.style.setProperty('--sky-blue', data.primaryColor);
      document.documentElement.style.setProperty('--sky-blue-light', data.primaryColorLight);
      document.documentElement.style.setProperty('--sky-blue-dark', data.primaryColorDark);
      document.documentElement.style.setProperty('--sky-blue-deep', data.primaryColorDeep);
      document.documentElement.style.setProperty('--text-dark', data.accentColor);
    } catch (err) {
      console.error('Failed to load theme settings:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ loadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
