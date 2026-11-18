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
          <TabTrigger name="track" href="/track" asChild>
            <WebTabButton>Track</WebTabButton>
          </TabTrigger>
          <TabTrigger name="kidney" href="/kidney" asChild>
            <WebTabButton>Kidney</WebTabButton>
          </TabTrigger>
          <TabTrigger name="learn" href="/learn" asChild>
            <WebTabButton>Learn</WebTabButton>
          </TabTrigger>
        </WebTabBar>
      </TabList>
    </Tabs>
  );
}
