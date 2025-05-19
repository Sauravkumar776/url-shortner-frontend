import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'indigo' | 'purple' | 'blue' | 'green' | 'rose';
type FontSize = 'sm' | 'base' | 'lg';

interface ThemeSettings {
  theme: Theme;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  reducedMotion: boolean;
  roundedCorners: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
}

const defaultSettings: ThemeSettings = {
  theme: 'system',
  colorScheme: 'indigo',
  fontSize: 'base',
  reducedMotion: false,
  roundedCorners: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('themeSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    
    const root = window.document.documentElement;
    
    // Apply theme
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
    
    // Apply color scheme
    root.style.setProperty('--color-primary', `var(--color-${settings.colorScheme}-600)`);
    root.style.setProperty('--color-primary-light', `var(--color-${settings.colorScheme}-500)`);
    root.style.setProperty('--color-primary-dark', `var(--color-${settings.colorScheme}-700)`);
    
    // Apply font size
    root.style.setProperty('--base-font-size', settings.fontSize === 'sm' ? '14px' : settings.fontSize === 'lg' ? '18px' : '16px');
    
    // Apply motion preferences
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.setProperty('--transition-duration', '200ms');
    }
    
    // Apply corner radius
    root.style.setProperty('--border-radius', settings.roundedCorners ? '0.5rem' : '0.25rem');

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.theme === 'system') {
        root.classList.toggle('dark', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}