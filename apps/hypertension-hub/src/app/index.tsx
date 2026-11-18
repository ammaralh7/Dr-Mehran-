import { Button, Card, Row, Screen, ThemedText, formatToday, useStore } from '@dr-mehran/shared';
import { router } from 'expo-router';

import { SevereAlert } from '@/components/severe-alert';
import { AVERAGE_NOTE, DISCLAIMER } from '@/content/copy';
import { BP_CATEGORY_LABELS, averageSince, bpSeverity, classifyBp, daysAgo, formatBp } from '@/lib/bp';
import { bpReadingsStore } from '@/lib/stores';

const SEVERE_ALERT_HOURS = 24;

function readingTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TodayScreen() {
  const readings = useStore(bpReadingsStore);
  const now = new Date();
  const latest = readings[0];
  const latestCategory = latest ? classifyBp(latest) : null;
  const latestSeverity = latestCategory ? bpSeverity(latestCategory) : 'ok';
  const average = averageSince(readings, daysAgo(now, 7));
  const averageCategory = average ? classifyBp(average) : null;

  const showSevere =
    latestCategory === 'severe' &&
    now.getTime() - new Date(latest.at).getTime() < SEVERE_ALERT_HOURS * 60 * 60 * 1000;

  return (
    <Screen title="Hypertension Hub" subtitle={formatToday(now)}>
      {showSevere ? <SevereAlert /> : null}

      <Card tone={latestSeverity === 'ok' ? 'neutral' : latestSeverity}>
        <ThemedText type="heading">Latest reading</ThemedText>
        {latest && latestCategory ? (
          <>
            <ThemedText type="metric">{formatBp(latest)}</ThemedText>
            <ThemedText type="smallBold">{BP_CATEGORY_LABELS[latestCategory]}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              mmHg · {readingTime(latest.at)}
              {latest.pulse != null ? ` · pulse ${latest.pulse}` : ''}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Log your first blood pressure reading to get started.
          </ThemedText>
        )}
        <Row>
          <Button label="Add a reading" onPress={() => router.navigate('/readings')} />
        </Row>
      </Card>

      <Card>
        <ThemedText type="heading">7-day average</ThemedText>
        {average && averageCategory ? (
          <>
            <ThemedText type="metric">{formatBp(average)}</ThemedText>
            <ThemedText type="smallBold">{BP_CATEGORY_LABELS[averageCategory]}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              mmHg · from {average.count} {average.count === 1 ? 'reading' : 'readings'}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Readings from the last 7 days will be averaged here.
          </ThemedText>
        )}
        <ThemedText type="small" themeColor="textSecondary">
          {AVERAGE_NOTE}
        </ThemedText>
        <Row>
          <Button label="See trends" variant="secondary" onPress={() => router.navigate('/trends')} />
        </Row>
      </Card>

      <ThemedText type="small" themeColor="textSecondary">
        {DISCLAIMER}
      </ThemedText>
    </Screen>
  );
}
