import { ElementType, ComponentProps, ReactElement } from 'react';
import { renderProcessedStyle } from './renderProcessedStyle';
import { toStyles } from './toStyles';
import type { ProcessedStyle, GetCss, Config } from './types';

const ws = /[\s]+/;
const errorMsg =
  'Please use the `css` prop instead of `className` to style a styled component.';

export function styled<Component extends ElementType, Context>(
  config: Config<Context>,
  BaseComponent: Component & {
    $component?: Component;
    $getCss?: GetCss<Context>;
    $getStyles?: () => Readonly<ProcessedStyle[]>;
    $styleCache?: Readonly<ProcessedStyle[]>;
  },
  getCss: GetCss<Context>,
): (
  props: ComponentProps<Component> & {
    css?: GetCss<Context>;
  },
) => ReactElement {
  const { $component, $getCss } = BaseComponent;

  if ($component && $getCss) {
    return styled(
      config,
      $component,
      // @ts-expect-error tsc failed to check the returned type
      (context: Context) => {
        const baseCss = $getCss(context);
        const overrideCss = getCss(context);

        // merge baseCss and overrideCss
        if (Array.isArray(baseCss) && Array.isArray(overrideCss)) {
          return [...baseCss, ...overrideCss];
        } else if (Array.isArray(baseCss)) {
          return [...baseCss, overrideCss];
        } else if (Array.isArray(overrideCss)) {
          return [baseCss, ...overrideCss];
        } else {
          return [baseCss, overrideCss];
        }
      },
    );
  }

  const StyledComponent = (
    props: ComponentProps<Component> & {
      css?: GetCss<Context>;
    },
  ): ReactElement => {
    const { className, css, ...restProps } = props;

    if (
      process.env.NODE_ENV !== 'production' &&
      typeof className === 'string' &&
      (className as string)
        .split(ws)
        .some((c) => c.startsWith(`${config.prefix}-`))
    ) {
      throw new Error(errorMsg);
    }

    const TypedStyledComponent = StyledComponent as typeof StyledComponent & {
      $styleCache?: Readonly<ProcessedStyle[]>;
    };

    let styles = TypedStyledComponent.$styleCache;

    if (!styles) {
      styles = toStyles(config, getCss);

      if (typeof BaseComponent !== 'string') {
        const baseGetStyles = BaseComponent.$getStyles;
        if (baseGetStyles) {
          styles = [...baseGetStyles(), ...styles];
        }
      }

      TypedStyledComponent.$styleCache = styles;
    }

    const [styleElement, styleClassName] = renderProcessedStyle(
      config,
      css ? [...styles, ...toStyles(config, css)] : styles,
    );

    return (
      <>
        {styleElement}
        {/* @ts-expect-error props type */}
        <BaseComponent
          className={
            className ? `${styleClassName} ${className}` : styleClassName
          }
          {...restProps}
        />
      </>
    );
  };

  // We don't want to expose these properties
  Object.assign(StyledComponent, {
    $component: BaseComponent,
    $getCss: getCss,
  });

  return StyledComponent;
}
