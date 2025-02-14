import { ElementType, ComponentProps, ReactElement, useMemo } from 'react';
import type { CreateCss, Config, CssProp } from './types';
import { renderCss } from './renderCss';

export function styled<Component extends ElementType, Context>(
  config: Config<Context>,
  BaseComponent: Component & {
    $component?: Component;
    $createCss?: CreateCss<Context>;
  },
  createCss: CreateCss<Context>,
): (
  props: ComponentProps<Component> & {
    css?: CssProp<Context>;
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
      css?: CssProp<Context>;
    },
  ): ReactElement => {
    const { className, css: rawCss, ...restProps } = props;
    // specify the type of css
    const css = rawCss as CssProp<Context>;
    const render = useMemo(() => renderCss(config, createCss, css), [css]);

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
