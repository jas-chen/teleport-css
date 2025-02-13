import { ElementType, ComponentProps, ReactElement } from 'react';
import type { Style, CreateCss, Config } from './types';
import { renderCss } from './renderCss';

export function styled<Component extends ElementType, Context>(
  config: Config<Context>,
  BaseComponent: Component & {
    $component?: Component;
    $createCss?: CreateCss<Context>;
    $getStyles?: () => Readonly<Style[]>;
    $styleCache?: Readonly<Style[]>;
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
    const { className, css: rawCss, ...restProps } = props;
    // infer the type of css
    const css = rawCss as CreateCss<Context> | undefined;
    const render = renderCss(config, createCss, css);

    return render(className, (finalClassName) => (
      /* @ts-expect-error props type */
      <BaseComponent className={finalClassName} {...restProps} />
    ));
  };

  // We don't want to expose these properties
  Object.assign(StyledComponent, {
    $component: BaseComponent,
    $createCss: createCss,
  });

  return StyledComponent;
}
