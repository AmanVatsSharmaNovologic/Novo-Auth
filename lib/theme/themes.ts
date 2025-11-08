export const THEME_COOKIE = "novo-theme";
export const THEME_STORAGE_KEY = "novo-theme";

export const THEMES = ["light", "dark", "construction"] as const;

export type ThemeName = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeName = "dark";

export const isThemeName = (value: string | undefined | null): value is ThemeName =>
  Boolean(value && (THEMES as readonly string[]).includes(value));


