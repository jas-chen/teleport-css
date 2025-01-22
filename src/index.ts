import { Config, GetCss, GetSingleCss } from './types';
import { styled as _styled } from './styled';
import {
  keyframes as _keyframes,
  counterStyle as _counterStyle,
} from './toStyles';
import { ElementType } from 'react';

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

  return {
    setConfig,
    styled,
    keyframes,
    counterStyle,
  };
}
