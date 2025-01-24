import { ElementType } from 'react';
import { styled } from './styled';
import type { Config, GetCss } from './types';

export function cloneAs<
  SourceComponent extends ElementType,
  NewComponent extends ElementType,
  Context,
>(
  config: Config<Context>,
  sourceComponent: SourceComponent & {
    $getCss?: GetCss<Context>;
  },
  newComponent: NewComponent,
) {
  const { $getCss } = sourceComponent;

  if (!$getCss) {
    throw new Error('Component is not a styled component.');
  }

  return styled(config, newComponent, $getCss);
}
