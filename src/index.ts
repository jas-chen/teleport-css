import { ElementType } from 'react';
import { Config, GetCss, GetSingleCss } from './types';
import { styled as _styled } from './styled';
import { cloneAs as _cloneAs } from './cloneAs';
import {
  keyframes as _keyframes,
  counterStyle as _counterStyle,
} from './toStyles';

export * from './types';
export { forwardCss } from './styled';

export function create<Context>(config: Config<Context>) {
  const internalConfig = { ...config };

  const setConfig = (newConfig: Config<Context>) => {
    Object.assign(internalConfig, newConfig);
  };

  const styled = <Component extends ElementType>(
    component: Component,
    getCss: GetCss<Context>,
  ) => {
    return _styled(internalConfig, component, getCss);
  };

  const keyframes = (getCss: GetSingleCss<Context>) => {
    return _keyframes(internalConfig, getCss);
  };

  const counterStyle = (getCss: GetSingleCss<Context>) => {
    return _counterStyle(internalConfig, getCss);
  };

  const cloneAs = <
    SourceComponent extends ElementType,
    NewComponent extends ElementType,
  >(
    sourceComponent: SourceComponent & {
      $getCss?: GetCss<Context>;
    },
    newComponent: NewComponent,
  ) => {
    return _cloneAs(internalConfig, sourceComponent, newComponent);
  };

  return {
    setConfig,
    styled,
    cloneAs,
    keyframes,
    counterStyle,
  };
}
