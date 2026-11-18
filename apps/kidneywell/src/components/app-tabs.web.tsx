/**
 * Browser preview navigation (development only — KidneyWell ships as an
 * iOS/Android app). Native tabs are not available on the web.
 *
 * Two expo-router/ui rules shape this file:
 * - `TabTrigger`s must be direct children of the `TabList` child, or the
 *   navigator never registers them and presses do nothing.
 * - Children of `asChild` components get their props merged with an object
 *   spread, so their `style` must be a flat object, never an array.
 */
import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <TabBar>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Today</TabButton>
          </TabTrigger>
          <TabTrigger name="track" href="/track" asChild>
            <TabButton>Track</TabButton>
          </TabTrigger>
          <TabTrigger name="kidney" href="/kidney" asChild>
            <TabButton>Kidney</TabButton>
          </TabTrigger>
          <TabTrigger name="learn" href="/learn" asChild>
            <TabButton>Learn</TabButton>
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

function TabBar({ children, style: _style, ...props }: TabListProps) {
  const theme = useTheme();
  return (
    <View
      {...props}
      style={StyleSheet.flatten([
        styles.bar,
        { backgroundColor: theme.background, borderTopColor: theme.border },
      ])}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

// `ref` is dropped because TabTriggerSlotProps types it for a View, not a Pressable.
function TabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      style={StyleSheet.flatten([styles.button, isFocused && { backgroundColor: theme.backgroundSelected }])}>
      <ThemedText type="smallBold" style={{ color: isFocused ? theme.tint : theme.textSecondary }}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.one,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
  },
});
