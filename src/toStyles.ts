import { cssToString } from './cssToString';
import { isCssValue } from './isCssValue';
import type { Config, CssInput, CreateCss, Style } from './types';

function memoize<V>(fn: (arg: string) => V): (arg: string) => V {
  const cache: Record<string, V> = Object.create(null);

  return (arg: string) => {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

export const delimiter = '_';
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
  return { code, endBrackets };
}

let processedStyle: Style[] = [];

const nestableAtRules = /^@(media|supports|layer|scope|container)\s/;
const cssLayer = /^@layer\s/;
const layerLength = '@layer '.length;

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
    return;
  }

  const { defaultLayer } = config;

  Object.entries(css).forEach(([key, value]) => {
    if (cssLayer.test(key)) {
      const i = key.indexOf('.');
      const layerName =
        i === -1
          ? key.substring(layerLength)
          : key.substring(layerLength, key.indexOf('.'));

      const code = cssToString({ [key]: value });

      processedStyle.push({
        group: `#${layerName}`,
        hash: `${config.prefix}${delimiter}${config.hashFn(code)}`,
        code: `{${code}}`,
      });
    } else if (isCssValue(value)) {
      const name = processStyleName(key);
      const isUnNestableAtRule = name[0] === '@' && !nestableAtRules.test(name);
      const valueAsString = String(value);

      let finalParents = parents;
      if (defaultLayer) {
        const wrapper = `@layer ${defaultLayer}`;
        if (finalParents) {
          finalParents = [wrapper, ...finalParents];
        } else {
          finalParents = [wrapper];
        }
      }

      const { code, endBrackets } = createCode(
        finalParents,
        name,
        valueAsString,
      );

      processedStyle.push({
        group: isUnNestableAtRule
          ? '@'
          : name.split('-')[
              // handle browser prefix
              name.startsWith('-') ? 2 : 0
            ],
        hash: `${config.prefix}${delimiter}${config.hashFn(code)}`,
        code: isUnNestableAtRule ? code : `{${code}}`,
        valueLength: valueAsString.length + endBrackets.length,
      });
    } else if (value && typeof value !== 'boolean') {
      processCss(config, value, parents ? [...parents, key] : [key]);
    }
  });
}

export function createDefinition<Context>(
  config: Config<Context>,
  type: string,
  createCss: CreateCss<Context>,
) {
  const css = createCss(config.context!);
  const body = `{${cssToString(css)}}`;
  const hash = `${config.prefix}${delimiter}${config.hashFn(`${type} ${body}`)}`;
  const name = `${type} ${hash}`;

  return {
    toString() {
      processedStyle.push({
        group: '@',
        hash: hash,
        code: createCode(undefined, name, body).code,
      });
      return hash;
    },
  };
}

export function keyframes<Context>(
  config: Config<Context>,
  createCss: CreateCss<Context>,
) {
  return createDefinition(config, '@keyframes', createCss);
}

export function counterStyle<Context>(
  config: Config<Context>,
  createCss: CreateCss<Context>,
) {
  return createDefinition(config, '@counter-style', createCss);
}

export function toStyles<Context>(
  config: Config<Context>,
  createCss: CreateCss<Context> | CssInput,
): Readonly<Style[]> {
  processedStyle = [];
  const css =
    typeof createCss === 'function' ? createCss(config.context!) : createCss;
  processCss(config, css);
  return processedStyle;
}
