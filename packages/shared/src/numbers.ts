/**
 * Parses a number typed by the user. Accepts a comma as the decimal
 * separator and surrounding spaces; returns NaN for empty or invalid text.
 */
export function parseNumber(text: string): number {
  const cleaned = text.trim().replace(',', '.');
  return cleaned === '' ? NaN : Number(cleaned);
}
