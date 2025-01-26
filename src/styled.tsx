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
    $getCss?: GetCss<Context>;
    $getStyles?: () => Readonly<ProcessedStyle[]>;
    $styleCache?: Readonly<ProcessedStyle[]>;
  },
  getCss: GetCss<Context>,
) {
  const isStyledComponent = Object.hasOwn(BaseComponent, '$getCss');

  const StyledComponent = (
    props: ComponentProps<Component> & {
      css?: GetCss<Context>;
    },
  ): ReactElement => {
    if (!isStyledComponent) {
      const { className, css, ...restProps } = props;

      const styles = (
        StyledComponent as typeof StyledComponent & {
          $getStyles?: () => Readonly<ProcessedStyle[]>;
        }
      ).$getStyles!();

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
    } else {
      const { css, ...restProps } = props;

      const { className } = restProps;

      if (
        typeof className === 'string' &&
        (className as string)
          .split(ws)
          .some((c) => c.startsWith(config.prefix!))
      ) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(errorMsg);
        } else {
          console.error(errorMsg);
        }
      }

      return (
        <>
          {/* @ts-expect-error props type */}
          <BaseComponent
            css={
              css
                ? (context: Context) => {
                    const baseCss = getCss(context);
                    const overrideCss = css(context);

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
                  }
                : getCss
            }
            {...restProps}
          />
        </>
      );
    }
  };

  // We don't want to expose these properties
  Object.assign(StyledComponent, {
    $getCss: getCss,
    $styleCache: undefined as Readonly<ProcessedStyle[]> | undefined,
    $getStyles: isStyledComponent
      ? undefined
      : (): Readonly<ProcessedStyle[]> => {
          const TypedStyledComponent =
            StyledComponent as typeof StyledComponent & {
              $styleCache?: Readonly<ProcessedStyle[]>;
            };

          if (TypedStyledComponent.$styleCache) {
            return TypedStyledComponent.$styleCache;
          }

          let styles = toStyles(config, getCss);

          if (typeof BaseComponent !== 'string') {
            const baseGetStyles = BaseComponent.$getStyles;
            if (baseGetStyles) {
              styles = [...baseGetStyles(), ...styles];
            }
          }

          TypedStyledComponent.$styleCache = styles;

          return styles;
        },
  });

  return StyledComponent;
}
