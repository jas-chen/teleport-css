export function isCssValue(value: unknown): value is string | number {
  return (
    typeof value === 'string' || (typeof value === 'number' && !isNaN(value))
  );
}
