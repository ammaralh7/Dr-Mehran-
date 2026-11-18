import { ThemedText } from '@/components/themed-text';
import { Card, Screen } from '@/components/ui';
import { DISCLAIMER, LEARN_TOPICS } from '@/content/copy';

export default function LearnScreen() {
  return (
    <Screen title="Learn" subtitle="Kidney health, explained. Articles are being written with Dr. Mehran.">
      {LEARN_TOPICS.map((topic) => (
        <Card key={topic.title}>
          <ThemedText type="heading">{topic.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {topic.summary}
          </ThemedText>
          <ThemedText type="smallBold" themeColor="tint">
            Coming soon
          </ThemedText>
        </Card>
      ))}
      <ThemedText type="small" themeColor="textSecondary">
        {DISCLAIMER}
      </ThemedText>
    </Screen>
  );
}
