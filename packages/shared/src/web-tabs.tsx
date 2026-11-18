/**
 * Tab bar pieces for the browser preview (development only — the apps ship
 * to iOS and Android, where they use native tabs).
 *
 * Use with expo-router/ui:
 *
 *   <TabList asChild>
 *     <WebTabBar>
 *       <TabTrigger name="index" href="/" asChild><WebTabButton>Today</WebTabButton></TabTrigger>
 *     </WebTabBar>
 *   </TabList>
 *
 * Two expo-router/ui rules shape this file:
 * - `TabTrigger`s must be direct children of the `TabList` child, or the
 *   navigator never registers them and presses do nothing.
 * - Children of `asChild` components get their props merged with an object
 *   spread, so their `style` must be a flat object, never an array.
 */
import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { MaxContentWidth, Radius, Spacing, useTheme } from './theme';
import { ThemedText } from './themed-text';

export function WebTabBar({ children, style: _style, ...props }: TabListProps) {
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
export function WebTabButton({ children, isFocused, ref: _ref, ...props }: TabTriggerSlotProps) {
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
