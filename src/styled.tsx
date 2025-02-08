import { ElementType, ComponentProps, ReactElement } from 'react';
import { renderProcessedStyle } from './renderProcessedStyle';
import { toStyles } from './toStyles';
import type { ProcessedStyle, CreateCss, Config } from './types';

const ws = /[\s]+/;
const errorMsg =
  'Please use the `css` prop instead of `className` to style a styled component.';

export function styled<Component extends ElementType, Context>(
  config: Config<Context>,
  BaseComponent: Component & {
    $component?: Component;
    $createCss?: CreateCss<Context>;
    $getStyles?: () => Readonly<ProcessedStyle[]>;
    $styleCache?: Readonly<ProcessedStyle[]>;
  },
  createCss: CreateCss<Context>,
): (
  props: ComponentProps<Component> & {
    css?: CreateCss<Context>;
  },
) => ReactElement {
  const { $component, $createCss } = BaseComponent;

  if ($component && $createCss) {
    return styled(config, $component, (context: Context) => [
      $createCss(context),
      createCss(context),
    ]);
  }

  const StyledComponent = (
    props: ComponentProps<Component> & {
      css?: CreateCss<Context>;
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
      styles = toStyles(config, createCss);

      if (typeof BaseComponent !== 'string') {
        const baseGetStyles = BaseComponent.$getStyles;
        if (baseGetStyles) {
          styles = [...baseGetStyles(), ...styles];
        }
      }

      TypedStyledComponent.$styleCache = styles;
    }

    const [styleElement, styleClassName] = renderProcessedStyle(
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
    $createCss: createCss,
  });

  return StyledComponent;
}
