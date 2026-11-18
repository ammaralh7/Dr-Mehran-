import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, NumberField, Row, Screen, Segmented, parseNumber } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { EGFR_GUIDANCE, EGFR_LIMITATIONS } from '@/content/copy';
import {
  GFR_CATEGORY_LABELS,
  calculateEgfr,
  gfrCategory,
  gfrCategorySeverity,
  validateEgfrInput,
  type CreatinineUnit,
  type EgfrInput,
  type Sex,
} from '@/lib/egfr';
import { formatDate } from '@/lib/format';
import { useStore } from '@/lib/persisted-store';
import { egfrResultsStore, removeEgfrResult, saveEgfrResult } from '@/lib/stores';
import { useTheme } from '@/hooks/use-theme';

const UNIT_OPTIONS = [
  { value: 'mg/dL', label: 'mg/dL' },
  { value: 'umol/L', label: 'µmol/L' },
] as const;

const SEX_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
] as const;

interface Calculated {
  input: EgfrInput;
  egfr: number;
  saved: boolean;
}

export default function KidneyScreen() {
  const theme = useTheme();
  const results = useStore(egfrResultsStore);
  const last = results[0];

  // Pre-fill from the last saved result so repeat checks are quick.
  const [creatinine, setCreatinine] = useState('');
  const [unit, setUnit] = useState<CreatinineUnit>(last?.unit ?? 'mg/dL');
  const [age, setAge] = useState(last ? String(last.age) : '');
  const [sex, setSex] = useState<Sex | null>(last?.sex ?? null);
  const [errors, setErrors] = useState<string[]>([]);
  const [calculated, setCalculated] = useState<Calculated | null>(null);

  function calculate() {
    if (sex == null) {
      setErrors(['Choose the sex used by the equation.']);
      setCalculated(null);
      return;
    }
    const input: EgfrInput = { creatinine: parseNumber(creatinine), unit, age: parseNumber(age), sex };
    const problems = validateEgfrInput(input);
    setErrors(problems);
    setCalculated(problems.length > 0 ? null : { input, egfr: calculateEgfr(input), saved: false });
  }

  function save() {
    if (!calculated || calculated.saved) return;
    saveEgfrResult({ ...calculated.input, egfr: calculated.egfr });
    setCalculated({ ...calculated, saved: true });
  }

  const category = calculated ? gfrCategory(calculated.egfr) : null;
  const severity = category ? gfrCategorySeverity(category) : 'ok';

  return (
    <Screen title="Kidney check" subtitle="Estimate your kidney function (eGFR) from a blood test.">
      <Card>
        <NumberField
          label="Creatinine (from your lab report)"
          value={creatinine}
          onChangeText={(text) => {
            setCreatinine(text);
            setCalculated(null);
          }}
          placeholder={unit === 'mg/dL' ? 'e.g. 1.1' : 'e.g. 97'}
        />
        <Segmented
          label="Unit"
          options={UNIT_OPTIONS}
          value={unit}
          onChange={(value) => {
            setUnit(value);
            setCalculated(null);
          }}
        />
        <NumberField
          label="Age"
          value={age}
          onChangeText={(text) => {
            setAge(text);
            setCalculated(null);
          }}
          placeholder="e.g. 55"
          suffix="years"
          decimal={false}
        />
        <Segmented
          label="Sex (used by the equation)"
          options={SEX_OPTIONS}
          value={sex}
          onChange={(value) => {
            setSex(value);
            setCalculated(null);
          }}
        />
        {errors.map((error) => (
          <ThemedText key={error} type="small" themeColor="urgent" accessibilityLiveRegion="polite">
            {error}
          </ThemedText>
        ))}
        <Row>
          <Button label="Calculate eGFR" onPress={calculate} />
        </Row>
      </Card>

      {calculated && category ? (
        <Card tone={severity === 'ok' ? 'neutral' : severity}>
          <ThemedText type="heading">Your estimated GFR</ThemedText>
          <ThemedText type="metric" accessibilityLiveRegion="polite">
            {Math.round(calculated.egfr)}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            mL/min/1.73 m²
          </ThemedText>
          <ThemedText type="smallBold">
            Stage {category}: {GFR_CATEGORY_LABELS[category]}
          </ThemedText>
          <ThemedText>{EGFR_GUIDANCE[category]}</ThemedText>
          <Row>
            <Button
              label={calculated.saved ? 'Saved to history' : 'Save to my history'}
              onPress={save}
              disabled={calculated.saved}
            />
          </Row>
        </Card>
      ) : null}

      <ThemedText type="small" themeColor="textSecondary">
        {EGFR_LIMITATIONS}
      </ThemedText>

      <Card>
        <ThemedText type="heading">History</ThemedText>
        {results.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            Saved results will appear here so you can see changes over time.
          </ThemedText>
        ) : (
          results.map((result) => {
            const resultCategory = gfrCategory(result.egfr);
            return (
              <View key={result.id} style={[styles.historyRow, { borderTopColor: theme.border }]}>
                <ThemedText type="heading" style={styles.historyValue}>
                  {Math.round(result.egfr)}
                </ThemedText>
                <View style={styles.historyText}>
                  <ThemedText type="smallBold">Stage {resultCategory}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatDate(result.at)} · creatinine {result.creatinine}{' '}
                    {result.unit === 'umol/L' ? 'µmol/L' : 'mg/dL'}
                  </ThemedText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete result from ${formatDate(result.at)}`}
                  hitSlop={12}
                  onPress={() => removeEgfrResult(result.id)}>
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
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  historyValue: {
    minWidth: 44,
    fontVariant: ['tabular-nums'],
  },
  historyText: {
    flex: 1,
  },
});
