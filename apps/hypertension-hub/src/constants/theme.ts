import type { AppTheme } from '@dr-mehran/shared';
import { useColorScheme } from 'react-native';

/**
 * Hypertension Hub palette (blue). Placeholder brand colors until
 * Dr. Mehran's branding is decided; every text pairing meets WCAG AA.
 */
export const HypertensionHubTheme: AppTheme = {
  light: {
    text: '#11161F',
    textSecondary: '#596273',
    background: '#FFFFFF',
    backgroundElement: '#F2F4F9',
    backgroundSelected: '#DEE4F2',
    border: '#D5DBE8',
    tint: '#2F5BD3',
    onTint: '#FFFFFF',
    caution: '#8A5A00',
    cautionBackground: '#FFF4DB',
    urgent: '#B42318',
    urgentBackground: '#FDECEA',
  },
  dark: {
    text: '#ECEEF2',
    textSecondary: '#A6AEBD',
    background: '#0B0D12',
    backgroundElement: '#181C25',
    backgroundSelected: '#252B38',
    border: '#2D3443',
    tint: '#8FB0FF',
    onTint: '#0A1A40',
    caution: '#F5C260',
    cautionBackground: '#33270C',
    urgent: '#FF8A80',
    urgentBackground: '#3A1512',
  },
};

/**
 * Chart series colors: categorical slots 1 (blue) and 2 (orange) of the
 * validated data-viz palette, stepped separately for light and dark mode.
 * Checked against the card surfaces above for color-blind separation.
 * Light-mode orange sits just under 3:1 contrast, so the chart carries
 * direct value labels and the readings list serves as its table view.
 */
const CHART_COLORS = {
  light: { systolic: '#2a78d6', diastolic: '#eb6834' },
  dark: { systolic: '#3987e5', diastolic: '#d95926' },
} as const;

export function useChartColors() {
  return CHART_COLORS[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
