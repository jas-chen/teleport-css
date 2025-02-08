import { ElementType } from 'react';
import { styled } from './styled';
import type { Config, CreateCss } from './types';

export function cloneAs<
  SourceComponent extends ElementType,
  NewComponent extends ElementType,
  Context,
>(
  config: Config<Context>,
  sourceComponent: SourceComponent & {
    $createCss?: CreateCss<Context>;
  },
  newComponent: NewComponent,
) {
  const { $createCss } = sourceComponent;

  if (!$createCss) {
    throw new Error('Component is not a styled component.');
  }

  return styled(config, newComponent, $createCss);
}
