import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, NumberField, ProgressBar, Row, Screen, Segmented, parseNumber } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { FLUID_GOAL_NOTE } from '@/content/copy';
import {
  FLUID_MAX_ENTRY_ML,
  FLUID_MAX_GOAL_ML,
  FLUID_MIN_GOAL_ML,
  entriesForDay,
  goalProgress,
  isValidEntryAmount,
  isValidGoal,
} from '@/lib/fluid';
import { formatTime } from '@/lib/format';
import { useStore } from '@/lib/persisted-store';
import { addFluid, fluidEntriesStore, fluidGoalStore, removeFluid, volumeUnitStore } from '@/lib/stores';
import {
  QUICK_ADD,
  VOLUME_UNIT_LABEL,
  formatVolume,
  fromMl,
  rangeInUnit,
  toMl,
  type VolumeUnit,
} from '@/lib/units';
import { useTheme } from '@/hooks/use-theme';

const UNIT_OPTIONS = [
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'ml', label: 'Millilitres (mL)' },
] as const;

function goalToText(goalMl: number | null, unit: VolumeUnit): string {
  return goalMl == null ? '' : String(Math.round(fromMl(goalMl, unit)));
}

export default function TrackScreen() {
  const theme = useTheme();
  const entries = useStore(fluidEntriesStore);
  const goal = useStore(fluidGoalStore);
  const unit = useStore(volumeUnitStore);
  const unitLabel = VOLUME_UNIT_LABEL[unit];

  const [custom, setCustom] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState(goal == null);
  const [goalText, setGoalText] = useState(goalToText(goal, unit));
  const [goalError, setGoalError] = useState<string | null>(null);

  const today = entriesForDay(entries, new Date());
  const total = today.reduce((sum, entry) => sum + entry.amountMl, 0);
  const progress = goalProgress(total, goal);

  function changeUnit(next: VolumeUnit) {
    volumeUnitStore.set(next);
    setGoalText(goalToText(goal, next));
    setCustom('');
    setCustomError(null);
    setGoalError(null);
  }

  function addCustom() {
    const amountMl = Math.round(toMl(parseNumber(custom), unit));
    if (!isValidEntryAmount(amountMl)) {
      const range = rangeInUnit(1, FLUID_MAX_ENTRY_ML, unit);
      setCustomError(`Enter an amount between ${range.min} and ${range.max} ${unitLabel}.`);
      return;
    }
    addFluid(amountMl);
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
    const goalMl = Math.round(toMl(parseNumber(goalText), unit));
    if (!isValidGoal(goalMl)) {
      const range = rangeInUnit(FLUID_MIN_GOAL_ML, FLUID_MAX_GOAL_ML, unit);
      setGoalError(`Enter a goal between ${range.min} and ${range.max} ${unitLabel}, or leave it empty.`);
      return;
    }
    fluidGoalStore.set(goalMl);
    setEditingGoal(false);
    setGoalError(null);
  }

  return (
    <Screen title="Track" subtitle="Log what you drink through the day.">
      <Card>
        <ThemedText type="heading">Today</ThemedText>
        <ThemedText type="metric">{formatVolume(total, unit)}</ThemedText>
        {progress != null && goal != null ? (
          <>
            <ProgressBar progress={progress} label="Progress toward today's fluid goal" />
            <ThemedText type="small" themeColor="textSecondary">
              {total >= goal ? 'Goal reached' : `${formatVolume(goal - total, unit)} to go`} · goal{' '}
              {formatVolume(goal, unit)}
            </ThemedText>
          </>
        ) : null}

        <ThemedText type="smallBold" style={styles.sectionLabel}>
          Quick add
        </ThemedText>
        <Row>
          {QUICK_ADD[unit].map((amount) => (
            <Button
              key={amount}
              label={`+ ${amount} ${unitLabel}`}
              onPress={() => addFluid(Math.round(toMl(amount, unit)))}
            />
          ))}
        </Row>

        <NumberField
          label="Other amount"
          value={custom}
          onChangeText={setCustom}
          placeholder={unit === 'oz' ? 'e.g. 6' : 'e.g. 200'}
          suffix={unitLabel}
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
              suffix={unitLabel}
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
            <ThemedText type="default">{goal == null ? 'No goal set' : formatVolume(goal, unit)}</ThemedText>
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
              <ThemedText>{formatVolume(entry.amountMl, unit)}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.logTime}>
                {formatTime(entry.at)}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${formatVolume(entry.amountMl, unit)} at ${formatTime(entry.at)}`}
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

      <Card>
        <Segmented label="Show amounts in" options={UNIT_OPTIONS} value={unit} onChange={changeUnit} />
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
