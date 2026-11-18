import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, ProgressBar, Row, Screen } from '@/components/ui';
import { DISCLAIMER } from '@/content/copy';
import { GFR_CATEGORY_LABELS, gfrCategory, gfrCategorySeverity } from '@/lib/egfr';
import { goalProgress, totalForDay } from '@/lib/fluid';
import { formatDate, formatToday } from '@/lib/format';
import { useStore } from '@/lib/persisted-store';
import { addFluid, egfrResultsStore, fluidEntriesStore, fluidGoalStore, volumeUnitStore } from '@/lib/stores';
import { QUICK_ADD, VOLUME_UNIT_LABEL, formatVolume, toMl } from '@/lib/units';

export default function TodayScreen() {
  const entries = useStore(fluidEntriesStore);
  const goal = useStore(fluidGoalStore);
  const results = useStore(egfrResultsStore);
  const unit = useStore(volumeUnitStore);
  // The standard cup: 8 oz or 250 mL.
  const quickAmount = QUICK_ADD[unit][1];

  const total = totalForDay(entries, new Date());
  const progress = goalProgress(total, goal);
  const latest = results[0];
  const category = latest ? gfrCategory(latest.egfr) : null;
  const severity = category ? gfrCategorySeverity(category) : 'ok';

  return (
    <Screen title="KidneyWell" subtitle={formatToday()}>
      <Card>
        <ThemedText type="heading">Fluids today</ThemedText>
        <ThemedText type="metric">{formatVolume(total, unit)}</ThemedText>
        {progress == null ? (
          <ThemedText type="small" themeColor="textSecondary">
            No daily goal set. Add the goal your care team recommends on the Track tab.
          </ThemedText>
        ) : (
          <>
            <ProgressBar progress={progress} label="Progress toward today's fluid goal" />
            <ThemedText type="small" themeColor="textSecondary">
              Goal {formatVolume(goal ?? 0, unit)}
            </ThemedText>
          </>
        )}
        <Row>
          <Button
            label={`+ ${quickAmount} ${VOLUME_UNIT_LABEL[unit]}`}
            onPress={() => addFluid(Math.round(toMl(quickAmount, unit)))}
          />
          <Button label="More options" variant="secondary" onPress={() => router.navigate('/track')} />
        </Row>
      </Card>

      <Card tone={severity === 'ok' ? 'neutral' : severity}>
        <ThemedText type="heading">Latest eGFR</ThemedText>
        {latest && category ? (
          <>
            <ThemedText type="metric">{Math.round(latest.egfr)}</ThemedText>
            <ThemedText type="smallBold">
              Stage {category}: {GFR_CATEGORY_LABELS[category]}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              mL/min/1.73 m² · saved {formatDate(latest.at)}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Enter the creatinine result from your latest blood test to estimate your kidney function.
          </ThemedText>
        )}
        <Row>
          <Button
            label={latest ? 'Add a new result' : 'Check my eGFR'}
            variant={latest ? 'secondary' : 'primary'}
            onPress={() => router.navigate('/kidney')}
          />
        </Row>
      </Card>

      <ThemedText type="small" themeColor="textSecondary">
        {DISCLAIMER}
      </ThemedText>
    </Screen>
  );
}
