"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { logInfo } from "@/lib/logging/console";
import {
  DEFAULT_THEME,
  THEME_COOKIE,
  THEME_STORAGE_KEY,
  THEMES,
  type ThemeName,
  isThemeName,
} from "@/lib/theme/themes";

type ThemeContextValue = {
  theme: ThemeName;
  themes: ThemeName[];
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: ThemeName;
};

const persistTheme = (theme: ThemeName) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures (e.g. SSR or privacy mode)
  }

  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
};

const applyThemeToDocument = (theme: ThemeName) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
};

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === "undefined") {
      return initialTheme ?? DEFAULT_THEME;
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeName(stored)) {
      return stored;
    }

    return initialTheme ?? DEFAULT_THEME;
  });

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: ThemeName) => {
    setThemeState(nextTheme);
    persistTheme(nextTheme);
    applyThemeToDocument(nextTheme);
    logInfo({
      scope: "theme",
      event: "change",
      context: { nextTheme },
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themes: [...THEMES],
      setTheme,
    }),
    [setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};


