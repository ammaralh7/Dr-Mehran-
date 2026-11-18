import { Platform } from 'react-native';

/**
 * KidneyWell palette. Placeholder brand colors until Dr. Mehran's branding
 * is decided; every pairing below meets WCAG AA contrast for body text.
 */
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#5A6570',
    background: '#FFFFFF',
    backgroundElement: '#F1F5F6',
    backgroundSelected: '#DDE7E9',
    border: '#D4DDE0',
    tint: '#0E7C86',
    onTint: '#FFFFFF',
    caution: '#8A5A00',
    cautionBackground: '#FFF4DB',
    urgent: '#B42318',
    urgentBackground: '#FDECEA',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#A4AEB5',
    background: '#0B0F10',
    backgroundElement: '#182022',
    backgroundSelected: '#243033',
    border: '#2C393C',
    tint: '#5CC8D2',
    onTint: '#00262A',
    caution: '#F5C260',
    cautionBackground: '#33270C',
    urgent: '#FF8A80',
    urgentBackground: '#3A1512',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
