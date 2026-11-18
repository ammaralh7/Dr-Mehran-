/** Browser preview navigation (development only; the app ships to iOS and Android). */
import { WebTabBar, WebTabButton } from '@dr-mehran/shared';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <WebTabBar>
          <TabTrigger name="index" href="/" asChild>
            <WebTabButton>Today</WebTabButton>
          </TabTrigger>
          <TabTrigger name="readings" href="/readings" asChild>
            <WebTabButton>Readings</WebTabButton>
          </TabTrigger>
          <TabTrigger name="trends" href="/trends" asChild>
            <WebTabButton>Trends</WebTabButton>
          </TabTrigger>
          <TabTrigger name="learn" href="/learn" asChild>
            <WebTabButton>Learn</WebTabButton>
          </TabTrigger>
        </WebTabBar>
      </TabList>
    </Tabs>
  );
}
