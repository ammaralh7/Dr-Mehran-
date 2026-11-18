import { Card, Screen, Segmented, ThemedText, useStore } from '@dr-mehran/shared';
import { useState } from 'react';

import { BpChart } from '@/components/bp-chart';
import { AVERAGE_NOTE } from '@/content/copy';
import { BP_CATEGORY_LABELS, averageSince, classifyBp, daysAgo, formatBp } from '@/lib/bp';
import { readingsInRange } from '@/lib/chart';
import { bpReadingsStore } from '@/lib/stores';

const RANGE_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
] as const;

type Range = (typeof RANGE_OPTIONS)[number]['value'];

export default function TrendsScreen() {
  const readings = useStore(bpReadingsStore);
  const [range, setRange] = useState<Range>('30');

  const to = new Date();
  const from = daysAgo(to, Number(range));
  const inRange = readingsInRange(readings, from, to);
  const average = averageSince(inRange, from);
  const highest = inRange.reduce<(typeof inRange)[number] | null>(
    (max, reading) => (max == null || reading.systolic > max.systolic ? reading : max),
    null,
  );

  return (
    <Screen title="Trends" subtitle="How your blood pressure is changing over time.">
      {/* The range filter scopes everything below it. */}
      <Segmented label="Show the last" options={RANGE_OPTIONS} value={range} onChange={setRange} />

      <Card>
        <BpChart readings={readings} from={from} to={to} />
      </Card>

      <Card>
        <ThemedText type="heading">Average</ThemedText>
        {average ? (
          <>
            <ThemedText type="metric">{formatBp(average)}</ThemedText>
            <ThemedText type="smallBold">{BP_CATEGORY_LABELS[classifyBp(average)]}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              mmHg · from {average.count} {average.count === 1 ? 'reading' : 'readings'}
              {highest ? ` · highest ${formatBp(highest)}` : ''}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            No readings in this period yet.
          </ThemedText>
        )}
        <ThemedText type="small" themeColor="textSecondary">
          {AVERAGE_NOTE} Every reading is listed on the Readings tab.
        </ThemedText>
      </Card>
    </Screen>
  );
}
