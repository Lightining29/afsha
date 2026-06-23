import { createContext, useContext } from 'react';

/**
 * Theme colors are now defined statically in src/styles/index.css (:root tokens).
 * The previous runtime override from /api/settings has been removed so the
 * hand-tuned sky-blue palette can't be clobbered by stale DB values.
 * This provider is kept as a no-op so legacy `useTheme()` callers still work.
 */
const ThemeContext = createContext({ loadTheme: () => {} });

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ loadTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
