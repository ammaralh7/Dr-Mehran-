import {
  Button,
  Card,
  NumberField,
  Row,
  Screen,
  Spacing,
  ThemedText,
  parseNumber,
  useStore,
  useTheme,
} from '@dr-mehran/shared';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SevereAlert } from '@/components/severe-alert';
import { BP_GUIDANCE, MEASURE_TIPS } from '@/content/copy';
import {
  BP_CATEGORY_LABELS,
  bpSeverity,
  classifyBp,
  formatBp,
  validateBpInput,
  type BpReading,
} from '@/lib/bp';
import { addReading, bpReadingsStore, removeReading } from '@/lib/stores';

function readingTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ReadingsScreen() {
  const theme = useTheme();
  const readings = useStore(bpReadingsStore);

  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState<BpReading | null>(null);

  function save() {
    const input = {
      systolic: parseNumber(systolic),
      diastolic: parseNumber(diastolic),
      pulse: parseNumber(pulse),
    };
    const problems = validateBpInput(input);
    setErrors(problems);
    if (problems.length > 0) {
      setSaved(null);
      return;
    }
    setSaved(
      addReading({
        systolic: Math.round(input.systolic),
        diastolic: Math.round(input.diastolic),
        pulse: Number.isNaN(input.pulse) ? null : Math.round(input.pulse),
      }),
    );
    setSystolic('');
    setDiastolic('');
    setPulse('');
  }

  const savedCategory = saved ? classifyBp(saved) : null;
  const savedSeverity = savedCategory ? bpSeverity(savedCategory) : 'ok';

  return (
    <Screen title="Readings" subtitle="Log your blood pressure from your home monitor.">
      <Card>
        <View style={styles.pair}>
          <View style={styles.flex}>
            <NumberField
              label="Systolic (top)"
              value={systolic}
              onChangeText={setSystolic}
              placeholder="e.g. 128"
              decimal={false}
            />
          </View>
          <View style={styles.flex}>
            <NumberField
              label="Diastolic (bottom)"
              value={diastolic}
              onChangeText={setDiastolic}
              placeholder="e.g. 82"
              decimal={false}
            />
          </View>
        </View>
        <NumberField
          label="Pulse (optional)"
          value={pulse}
          onChangeText={setPulse}
          placeholder="e.g. 70"
          suffix="bpm"
          decimal={false}
        />
        {errors.map((error) => (
          <ThemedText key={error} type="small" themeColor="urgent" accessibilityLiveRegion="polite">
            {error}
          </ThemedText>
        ))}
        <Row>
          <Button label="Save reading" onPress={save} />
        </Row>
      </Card>

      {saved && savedCategory ? (
        <>
          <Card tone={savedSeverity === 'ok' ? 'neutral' : savedSeverity}>
            <ThemedText type="heading">Saved</ThemedText>
            <ThemedText type="metric" accessibilityLiveRegion="polite">
              {formatBp(saved)}
            </ThemedText>
            <ThemedText type="smallBold">{BP_CATEGORY_LABELS[savedCategory]}</ThemedText>
            <ThemedText>{BP_GUIDANCE[savedCategory]}</ThemedText>
          </Card>
          {savedCategory === 'severe' ? <SevereAlert /> : null}
        </>
      ) : null}

      <Card>
        <ThemedText type="heading">Before you measure</ThemedText>
        {MEASURE_TIPS.map((tip) => (
          <ThemedText key={tip} type="small" themeColor="textSecondary">
            • {tip}
          </ThemedText>
        ))}
      </Card>

      <Card>
        <ThemedText type="heading">History</ThemedText>
        {readings.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            Your readings will appear here.
          </ThemedText>
        ) : (
          readings.map((reading) => {
            const category = classifyBp(reading);
            return (
              <View key={reading.id} style={[styles.historyRow, { borderTopColor: theme.border }]}>
                <ThemedText type="heading" style={styles.historyValue}>
                  {formatBp(reading)}
                </ThemedText>
                <View style={styles.flex}>
                  <ThemedText type="smallBold">{BP_CATEGORY_LABELS[category]}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {readingTime(reading.at)}
                    {reading.pulse != null ? ` · pulse ${reading.pulse}` : ''}
                  </ThemedText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete reading ${formatBp(reading)} from ${readingTime(reading.at)}`}
                  hitSlop={12}
                  onPress={() => removeReading(reading.id)}>
                  <ThemedText type="smallBold" themeColor="tint">
                    Delete
                  </ThemedText>
                </Pressable>
              </View>
            );
          })
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pair: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  historyValue: {
    minWidth: 76,
    fontVariant: ['tabular-nums'],
  },
});
