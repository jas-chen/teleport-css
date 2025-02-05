export function isCssValue(value: unknown) {
  return (
    typeof value === 'string' ||
    (typeof value === 'number' && !isNaN(value)) ||
    (Object.hasOwn(value as object, 'toString') &&
      typeof (value as object).toString === 'function')
  );
}
