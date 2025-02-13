import { ReactElement, ReactNode } from 'react';
import { Config, CreateCss, CssInput, Style } from './types';
import { toStyles } from './toStyles';

type Renderer = (
  additionalClassName: string | undefined | null,
  render: (className: string) => ReactNode,
) => ReactElement;

const ws = /[\s]+/;

function getStyles<Context>(
  config: Config<Context>,
  createCss:
    | (CreateCss<Context> & { $styleCache?: Readonly<Style[]> })
    | (CssInput & { $styleCache?: Readonly<Style[]> }),
): Readonly<Style[]> {
  const { $styleCache } = createCss;

  if ($styleCache) {
    return $styleCache;
  }

  const styles = toStyles(config, createCss);
  createCss.$styleCache = styles;
  return styles;
}

function deduplicateStyles(styles: Readonly<Style[]>): Readonly<Style[]> {
  const map = new Map<string, Readonly<Style>>();

  for (const style of styles) {
    const key =
      style.group === '@'
        ? style.hash
        : style.code.substring(0, style.code.length - 1 - style.valueLength!);

    if (style.group !== '@') {
      map.delete(key);
    }

    map.set(key, style);
  }

  return Array.from(map.values());
}

export function renderCss<Context>(
  config: Config<Context>,
  createStaticCss: CreateCss<Context> & {
    $rendererCache?: Renderer;
    $styleCache?: Readonly<Style[]>;
  },
  createDynamicCss:
    | (CreateCss<Context> & { $styleCache?: Readonly<Style[]> })
    | CssInput
    | undefined
    | null,
): Renderer {
  const { $rendererCache } = createStaticCss;

  // happy path
  if ($rendererCache && !createDynamicCss) {
    return $rendererCache;
  }

  const groupCount: Record<string, number> = {};
  const classNames: string[] = [];

  const staticStyles = getStyles(config, createStaticCss);
  const styles = deduplicateStyles(
    createDynamicCss
      ? staticStyles.concat(getStyles(config, createDynamicCss))
      : staticStyles,
  );

  const elements = styles.map((style) => {
    const { hash, group, code } = style;

    if (group === '@') {
      return (
        <style key={hash} href={hash} precedence="0">
          {code}
        </style>
      );
    }

    let precedence: number | undefined = undefined;
    precedence = (groupCount[group] || 0) + 1;
    groupCount[group] = precedence;

    const finalHash = `${hash}${precedence}`;
    classNames.push(finalHash);
    const classSel = `.${finalHash}`;
    const finalCode = `${classSel}${code}`;

    return (
      <style
        key={finalHash}
        href={finalHash}
        precedence={precedence === undefined ? undefined : String(precedence)}
      >
        {finalCode}
      </style>
    );
  });

  const styleClassName = classNames.join(' ');

  const renderer: Renderer = function (additionalClassName, render) {
    if (
      process.env.NODE_ENV !== 'production' &&
      additionalClassName
        ?.split(ws)
        .some((c) => c.startsWith(`${config.prefix}-`))
    ) {
      throw new Error(
        'Styled components require the `css` prop for dynamic styling. The `className` prop could lead to unexpected styling behavior.',
      );
    }

    const className = additionalClassName
      ? `${styleClassName} ${additionalClassName}`
      : styleClassName;

    return (
      <>
        {elements}
        {render(className)}
      </>
    );
  };

  if (!createDynamicCss) {
    createStaticCss.$rendererCache = renderer;
  }

  return renderer;
}
