import { Spacing, ThemedText, useTheme } from '@dr-mehran/shared';
import { useState } from 'react';
import { Platform, StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import { useChartColors } from '@/constants/theme';
import { formatBp, type BpReading } from '@/lib/bp';
import { STAGE1_DIASTOLIC, STAGE1_SYSTOLIC, nearestIndex, readingsInRange, yScale } from '@/lib/chart';

const PLOT_HEIGHT = 200;
const AXIS_HEIGHT = 24;
const PAD_LEFT = 32; // y-axis tick labels
const PAD_RIGHT = 36; // direct labels at the line ends
const PAD_TOP = 14;
// SVG text does not inherit the app font on the web; native already uses the system font.
const SVG_FONT = Platform.select({ web: 'system-ui, -apple-system, "Segoe UI", sans-serif' });

function shortDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function readingTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Systolic and diastolic readings over time on one mmHg axis, with the
 * 130/80 stage 1 thresholds as reference lines. Touch and drag to read any
 * reading; the readout defaults to the latest one.
 */
export function BpChart({ readings, from, to }: { readings: readonly BpReading[]; from: Date; to: Date }) {
  const theme = useTheme();
  const colors = useChartColors();
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const points = readingsInRange(readings, from, to);
  const scale = yScale(points);
  const plotWidth = Math.max(width - PAD_LEFT - PAD_RIGHT, 1);
  const span = Math.max(to.getTime() - from.getTime(), 1);

  const x = (iso: string) => PAD_LEFT + ((new Date(iso).getTime() - from.getTime()) / span) * plotWidth;
  const y = (value: number) => PAD_TOP + ((scale.max - value) / (scale.max - scale.min)) * PLOT_HEIGHT;
  const xs = points.map((point) => x(point.at));

  const path = (key: 'systolic' | 'diastolic') =>
    points
      .map((point, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${y(point[key]).toFixed(1)}`)
      .join(' ');

  const active = points.find((point) => point.id === selected) ?? points[points.length - 1];
  const activeIndex = active ? points.indexOf(active) : -1;
  const last = points[points.length - 1];

  function select(event: GestureResponderEvent) {
    if (points.length === 0) return;
    setSelected(points[nearestIndex(xs, event.nativeEvent.locationX)].id);
  }

  const summary =
    points.length === 0
      ? 'Blood pressure chart: no readings in this period.'
      : `Blood pressure chart: ${points.length} readings from ${shortDate(from)} to ${shortDate(to)}. Latest ${formatBp(last)}.`;

  return (
    <View style={styles.container}>
      <View style={styles.readout}>
        {active ? (
          <>
            <ThemedText type="heading">
              {formatBp(active)} <ThemedText themeColor="textSecondary">mmHg</ThemedText>
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {readingTime(active.at)}
              {active.pulse != null ? ` · pulse ${active.pulse}` : ''}
            </ThemedText>
          </>
        ) : (
          <ThemedText themeColor="textSecondary">No readings in this period.</ThemedText>
        )}
      </View>

      <View
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        accessible
        accessibilityRole="image"
        accessibilityLabel={summary}
        onStartShouldSetResponder={() => points.length > 0}
        onMoveShouldSetResponder={() => points.length > 0}
        onResponderGrant={select}
        onResponderMove={select}
        onResponderTerminationRequest={() => true}>
        {width > 0 ? (
          <Svg width={width} height={PLOT_HEIGHT + PAD_TOP + AXIS_HEIGHT}>
            {/* Gridlines and y-axis ticks: solid hairlines, recessive. */}
            {scale.ticks.map((tick) => (
              <Line
                key={`grid-${tick}`}
                x1={PAD_LEFT}
                x2={PAD_LEFT + plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                stroke={theme.border}
                strokeWidth={1}
              />
            ))}
            {scale.ticks.map((tick) => (
              <SvgText
                fontFamily={SVG_FONT}
                key={`tick-${tick}`}
                x={PAD_LEFT - 6}
                y={y(tick) + 4}
                fontSize={11}
                fill={theme.textSecondary}
                textAnchor="end">
                {tick}
              </SvgText>
            ))}

            {/* Stage 1 thresholds: dashed so they read as limits, not gridlines. */}
            {[STAGE1_SYSTOLIC, STAGE1_DIASTOLIC].map((limit) => (
              <Line
                key={`limit-${limit}`}
                x1={PAD_LEFT}
                x2={PAD_LEFT + plotWidth}
                y1={y(limit)}
                y2={y(limit)}
                stroke={theme.textSecondary}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {/* Crosshair at the selected reading. */}
            {activeIndex >= 0 && selected ? (
              <Line
                x1={xs[activeIndex]}
                x2={xs[activeIndex]}
                y1={PAD_TOP}
                y2={PAD_TOP + PLOT_HEIGHT}
                stroke={theme.textSecondary}
                strokeWidth={1}
              />
            ) : null}

            {points.length > 1 ? (
              <>
                <Path
                  d={path('systolic')}
                  stroke={colors.systolic}
                  strokeWidth={2}
                  fill="none"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <Path
                  d={path('diastolic')}
                  stroke={colors.diastolic}
                  strokeWidth={2}
                  fill="none"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </>
            ) : null}

            {/* Markers with a 2px ring in the surface color. */}
            {points.map((point, i) => {
              const r = i === activeIndex ? 5 : 4;
              return [
                <Circle
                  key={`s-${point.id}`}
                  cx={xs[i]}
                  cy={y(point.systolic)}
                  r={r}
                  fill={colors.systolic}
                  stroke={theme.backgroundElement}
                  strokeWidth={2}
                />,
                <Circle
                  key={`d-${point.id}`}
                  cx={xs[i]}
                  cy={y(point.diastolic)}
                  r={r}
                  fill={colors.diastolic}
                  stroke={theme.backgroundElement}
                  strokeWidth={2}
                />,
              ];
            })}

            {/* Direct labels at the latest reading, in text ink (never the series color). */}
            {last ? (
              <>
                <SvgText
                  fontFamily={SVG_FONT}
                  x={xs[xs.length - 1] + 8}
                  y={y(last.systolic) + 4}
                  fontSize={12}
                  fontWeight="600"
                  fill={theme.text}>
                  {last.systolic}
                </SvgText>
                <SvgText
                  fontFamily={SVG_FONT}
                  x={xs[xs.length - 1] + 8}
                  y={y(last.diastolic) + 4}
                  fontSize={12}
                  fontWeight="600"
                  fill={theme.text}>
                  {last.diastolic}
                </SvgText>
              </>
            ) : null}

            {/* X axis: start, middle and end dates. */}
            {[
              { date: from, anchor: 'start' as const, at: PAD_LEFT },
              {
                date: new Date((from.getTime() + to.getTime()) / 2),
                anchor: 'middle' as const,
                at: PAD_LEFT + plotWidth / 2,
              },
              { date: to, anchor: 'end' as const, at: PAD_LEFT + plotWidth },
            ].map(({ date, anchor, at }) => (
              <SvgText
                fontFamily={SVG_FONT}
                key={anchor}
                x={at}
                y={PAD_TOP + PLOT_HEIGHT + 18}
                fontSize={11}
                fill={theme.textSecondary}
                textAnchor={anchor}>
                {shortDate(date)}
              </SvgText>
            ))}
          </Svg>
        ) : (
          <View style={{ height: PLOT_HEIGHT + PAD_TOP + AXIS_HEIGHT }} />
        )}
      </View>

      <View style={styles.legend}>
        <LegendItem color={colors.systolic} label="Systolic (top)" />
        <LegendItem color={colors.diastolic} label="Diastolic (bottom)" />
        <LegendItem color={theme.textSecondary} label="130/80: stage 1 begins" dashed />
      </View>
    </View>
  );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <Svg width={16} height={8}>
        <Line
          x1={0}
          x2={16}
          y1={4}
          y2={4}
          stroke={color}
          strokeWidth={dashed ? 1 : 2}
          strokeDasharray={dashed ? '3 3' : undefined}
          strokeLinecap="round"
        />
      </Svg>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  readout: {
    minHeight: 44,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.three,
    rowGap: Spacing.one,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
