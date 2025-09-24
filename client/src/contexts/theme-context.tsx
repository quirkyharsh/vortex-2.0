import { createContext, useContext, useEffect, ReactNode } from 'react';

export type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme: Theme = 'light';
  
  // No-op setTheme function for backward compatibility
  const setTheme = () => {};

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes and only add light
    root.classList.remove('dark', 'creative');
    root.classList.add('light');
    
    // Remove any saved theme from localStorage
    localStorage.removeItem('theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}