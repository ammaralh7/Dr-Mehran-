import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, NumberField, ProgressBar, Row, Screen, parseNumber } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { FLUID_GOAL_NOTE } from '@/content/copy';
import {
  FLUID_MAX_ENTRY_ML,
  FLUID_MAX_GOAL_ML,
  FLUID_MIN_GOAL_ML,
  FLUID_QUICK_ADD_ML,
  entriesForDay,
  goalProgress,
  isValidEntryAmount,
  isValidGoal,
} from '@/lib/fluid';
import { formatMl, formatTime } from '@/lib/format';
import { useStore } from '@/lib/persisted-store';
import { addFluid, fluidEntriesStore, fluidGoalStore, removeFluid } from '@/lib/stores';
import { useTheme } from '@/hooks/use-theme';

export default function TrackScreen() {
  const theme = useTheme();
  const entries = useStore(fluidEntriesStore);
  const goal = useStore(fluidGoalStore);

  const [custom, setCustom] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState(goal == null);
  const [goalText, setGoalText] = useState(goal == null ? '' : String(goal));
  const [goalError, setGoalError] = useState<string | null>(null);

  const today = entriesForDay(entries, new Date());
  const total = today.reduce((sum, entry) => sum + entry.amountMl, 0);
  const progress = goalProgress(total, goal);

  function addCustom() {
    const amount = parseNumber(custom);
    if (!isValidEntryAmount(amount)) {
      setCustomError(`Enter an amount between 1 and ${FLUID_MAX_ENTRY_ML} mL.`);
      return;
    }
    addFluid(Math.round(amount));
    setCustom('');
    setCustomError(null);
  }

  function saveGoal() {
    if (goalText.trim() === '') {
      fluidGoalStore.set(null);
      setEditingGoal(false);
      setGoalError(null);
      return;
    }
    const value = parseNumber(goalText);
    if (!isValidGoal(value)) {
      setGoalError(`Enter a goal between ${FLUID_MIN_GOAL_ML} and ${FLUID_MAX_GOAL_ML} mL, or leave it empty.`);
      return;
    }
    fluidGoalStore.set(Math.round(value));
    setEditingGoal(false);
    setGoalError(null);
  }

  return (
    <Screen title="Track" subtitle="Log what you drink through the day.">
      <Card>
        <ThemedText type="heading">Today</ThemedText>
        <ThemedText type="metric">{formatMl(total)}</ThemedText>
        {progress != null && goal != null ? (
          <>
            <ProgressBar progress={progress} label="Progress toward today's fluid goal" />
            <ThemedText type="small" themeColor="textSecondary">
              {total >= goal ? 'Goal reached' : `${formatMl(goal - total)} to go`} · goal {formatMl(goal)}
            </ThemedText>
          </>
        ) : null}

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Quick add
        </ThemedText>
        <Row>
          {FLUID_QUICK_ADD_ML.map((amount) => (
            <Button key={amount} label={`+ ${amount} mL`} onPress={() => addFluid(amount)} />
          ))}
        </Row>

        <NumberField
          label="Other amount"
          value={custom}
          onChangeText={setCustom}
          placeholder="e.g. 200"
          suffix="mL"
          decimal={false}
        />
        {customError ? (
          <ThemedText type="small" themeColor="urgent">
            {customError}
          </ThemedText>
        ) : null}
        <Row>
          <Button label="Add" variant="secondary" onPress={addCustom} disabled={custom.trim() === ''} />
        </Row>
      </Card>

      <Card>
        <ThemedText type="heading">Daily goal</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {FLUID_GOAL_NOTE}
        </ThemedText>
        {editingGoal ? (
          <>
            <NumberField
              label="Daily fluid goal"
              value={goalText}
              onChangeText={setGoalText}
              placeholder="From your care team"
              suffix="mL"
              decimal={false}
            />
            {goalError ? (
              <ThemedText type="small" themeColor="urgent">
                {goalError}
              </ThemedText>
            ) : null}
            <Row>
              <Button label="Save goal" onPress={saveGoal} />
            </Row>
          </>
        ) : (
          <>
            <ThemedText type="default">{goal == null ? 'No goal set' : formatMl(goal)}</ThemedText>
            <Row>
              <Button label="Change goal" variant="secondary" onPress={() => setEditingGoal(true)} />
            </Row>
          </>
        )}
      </Card>

      <Card>
        <ThemedText type="heading">Today&apos;s log</ThemedText>
        {today.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            Nothing logged yet today.
          </ThemedText>
        ) : (
          today.map((entry) => (
            <View key={entry.id} style={[styles.logRow, { borderTopColor: theme.border }]}>
              <ThemedText>{formatMl(entry.amountMl)}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.logTime}>
                {formatTime(entry.at)}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${formatMl(entry.amountMl)} at ${formatTime(entry.at)}`}
                hitSlop={12}
                onPress={() => removeFluid(entry.id)}>
                <ThemedText type="smallBold" themeColor="tint">
                  Remove
                </ThemedText>
              </Pressable>
            </View>
          ))
        )}
      </Card>

      <ThemedText type="small" themeColor="textSecondary">
        Sodium and potassium tracking is coming next.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginTop: Spacing.two,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  logTime: {
    flex: 1,
  },
});
