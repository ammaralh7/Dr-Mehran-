import { Button, Card, Row, ThemedText } from '@dr-mehran/shared';
import { Linking } from 'react-native';

import { SEVERE_READING } from '@/content/copy';

/** Shown whenever a reading is above 180/120. Wording is in content/copy.ts for clinical review. */
export function SevereAlert() {
  return (
    <Card tone="urgent">
      <ThemedText type="heading" accessibilityRole="header">
        {SEVERE_READING.title}
      </ThemedText>
      {SEVERE_READING.steps.map((step, index) => (
        <ThemedText key={step}>
          {index + 1}. {step}
        </ThemedText>
      ))}
      <ThemedText type="smallBold" themeColor="urgent">
        {SEVERE_READING.emergency}
      </ThemedText>
      <Row>
        <Button
          label="Call 911"
          accessibilityHint="Opens your phone to call emergency services"
          onPress={() => Linking.openURL('tel:911')}
        />
      </Row>
    </Card>
  );
}
