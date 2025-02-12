import { cssToString } from './cssToString';
import { isCssValue } from './isCssValue';
import type {
  Config,
  CssInput,
  CreateCss,
  CreateSingleCss,
  Style,
} from './types';

function memoize<V>(fn: (arg: string) => V): (arg: string) => V {
  const cache: Record<string, V> = Object.create(null);

  return (arg: string) => {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

const hyphenateRegex = /[A-Z]|^ms/g;
const isCustomProperty = (property: string) => property.charCodeAt(1) === 45;

const processStyleName = /* #__PURE__ */ memoize((styleName: string) =>
  isCustomProperty(styleName)
    ? styleName
    : styleName.replace(hyphenateRegex, '-$&').toLowerCase(),
);

export function isPlainObject(obj: unknown): obj is object {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return (
    Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null
  );
}

declare global {
  interface ArrayConstructor {
    isArray(
      arg: ReadonlyArray<unknown> | unknown,
    ): arg is ReadonlyArray<unknown>;
  }
}

function createCode(
  parents: string[] | undefined,
  name: string,
  value: string,
) {
  let code = parents?.length ? `${parents.join('{')}{` : '';
  const isAtRule = name.startsWith('@');

  let endBrackets = '';
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') {
      endBrackets += '}';
    }
  }
  code += `${name}${isAtRule ? '' : ':'}${value}${endBrackets}`;
  return code;
}

let processedStyle: Style[] = [];

function processCss<Context>(
  config: Config<Context>,
  css: CssInput,
  parents: string[] | undefined = undefined,
) {
  if (Array.isArray(css)) {
    css.forEach((v) => processCss(config, v, parents));
    return;
  }

  if (!isPlainObject(css)) {
    const errorMsg = `Expected a plain object, got ${typeof css}: ${css}.`;

    if (process.env.NODE_ENV !== 'production') {
      throw new Error(errorMsg);
    } else {
      console.error(errorMsg);
    }

    return;
  }

  Object.entries(css).forEach(([key, value]) => {
    if (isCssValue(value)) {
      const name = processStyleName(key);
      const isAtRule = name.startsWith('@');
      const code = createCode(parents, name, String(value));

      processedStyle.push({
        group: isAtRule
          ? '@'
          : name.split('-')[
              // handle browser prefix
              name.startsWith('-') ? 2 : 0
            ],
        hash: `${config.prefix}-${config.hashFn(code)}`,
        code: isAtRule ? code : `{${code}}`,
      });
    } else if (Array.isArray(value)) {
      value.forEach((v) =>
        processCss(config, v, parents ? [...parents, key] : [key]),
      );
    } else if (isPlainObject(value)) {
      processCss(config, value, parents ? [...parents, key] : [key]);
    }
  });
}

export function createDefinition<Context>(
  config: Config<Context>,
  type: string,
  createCss: CreateSingleCss<Context>,
) {
  const css = createCss(config.context!);
  const body = `{${cssToString(css)}}`;
  const hash = `${config.prefix}-${config.hashFn(`${type} ${body}`)}`;
  const name = `${type} ${hash}`;

  return {
    toString() {
      processedStyle.push({
        group: '@',
        hash: hash,
        code: createCode(undefined, name, body),
      });
      return hash;
    },
  };
}

export function keyframes<Context>(
  config: Config<Context>,
  createCss: CreateSingleCss<Context>,
) {
  return createDefinition(config, '@keyframes', createCss);
}

export function counterStyle<Context>(
  config: Config<Context>,
  createCss: CreateSingleCss<Context>,
) {
  return createDefinition(config, '@counter-style', createCss);
}

export function toStyles<Context>(
  config: Config<Context>,
  createCss: CreateCss<Context>,
): Style[] {
  processedStyle = [];
  const css = createCss(config.context!);
  processCss(config, css);
  return processedStyle;
}
