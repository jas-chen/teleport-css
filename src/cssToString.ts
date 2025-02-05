import { isCssValue } from './isCssValue';
import { isPlainObject } from './toStyles';
import type { CSSObject } from './types';

export function cssToString(css: CSSObject, isRoot: boolean = true): string {
  if (!isPlainObject(css)) {
    const errorMsg = `Expected a plain object, got ${typeof css}: ${css}.`;

    if (process.env.NODE_ENV !== 'production') {
      throw new Error(errorMsg);
    } else {
      console.error(errorMsg);
    }

    return '';
  }

  let result = '';
  Object.entries(css).forEach(([key, value], i, array) => {
    if (i === 0 && !isRoot) {
      result += '{';
    }
    if (isCssValue(value)) {
      result += `${key}:${value}${i !== array.length - 1 ? ';' : ''}`;
    } else if (Array.isArray(value)) {
      value.forEach((v) => (result += cssToString(v, false)));
    } else if (isPlainObject(value)) {
      result += `${key} ${cssToString(value, false)}`;
    }
    if (i === array.length - 1 && !isRoot) {
      result += '}';
    }
  });

  return result;
}
