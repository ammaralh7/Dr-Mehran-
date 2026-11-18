import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundSelected}
      labelStyle={{ selected: { color: theme.tint } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="track">
        <NativeTabs.Trigger.Label>Track</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'drop', selected: 'drop.fill' }} md="water_drop" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="kidney">
        <NativeTabs.Trigger.Label>Kidney</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="testtube.2" md="science" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="learn">
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'book', selected: 'book.fill' }} md="menu_book" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
