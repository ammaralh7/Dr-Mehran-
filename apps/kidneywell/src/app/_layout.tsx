import { AppThemeProvider } from '@dr-mehran/shared';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { KidneyWellTheme } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AppThemeProvider theme={KidneyWellTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <AppTabs />
      </ThemeProvider>
    </AppThemeProvider>
  );
}
