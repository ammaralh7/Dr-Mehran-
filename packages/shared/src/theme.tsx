import { createContext, useContext, type ReactNode } from 'react';
import { Platform, useColorScheme } from 'react-native';

/**
 * The colors every shared component draws with. Each app passes its own
 * brand palette to <AppThemeProvider>; text pairings must meet WCAG AA.
 */
export interface Palette {
  text: string;
  textSecondary: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  border: string;
  tint: string;
  onTint: string;
  caution: string;
  cautionBackground: string;
  urgent: string;
  urgentBackground: string;
}

export interface AppTheme {
  light: Palette;
  dark: Palette;
}

export type ThemeColor = keyof Palette;

const ThemeContext = createContext<AppTheme | null>(null);

export function AppThemeProvider({ theme, children }: { theme: AppTheme; children: ReactNode }) {
  return <ThemeContext value={theme}>{children}</ThemeContext>;
}

/** The active palette for the device's light or dark mode. */
export function useTheme(): Palette {
  const theme = useContext(ThemeContext);
  const scheme = useColorScheme();
  if (!theme) {
    throw new Error('useTheme() must be used inside <AppThemeProvider>.');
  }
  return scheme === 'dark' ? theme.dark : theme.light;
}

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 14,
  large: 20,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 640;
