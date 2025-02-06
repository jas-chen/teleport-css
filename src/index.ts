import { ElementType } from 'react';
import type { ConfigInput, Config, GetCss, GetSingleCss } from './types';
import { styled as _styled } from './styled';
import { cloneAs as _cloneAs } from './cloneAs';
import { renderGlobalStyle as _renderGlobalStyle } from './renderGlobalStyle';
import {
  keyframes as _keyframes,
  counterStyle as _counterStyle,
} from './toStyles';

export * from './types';

const defaultPrefix = 'x';

export function create<Context>(config: ConfigInput<Context>) {
  let internalConfig: Config<Context> = {
    ...config,
    prefix: config.prefix || defaultPrefix,
  };

  const setConfig = (newConfig: ConfigInput<Context>) => {
    Object.assign(internalConfig, newConfig, {
      prefix: newConfig.prefix || internalConfig.prefix,
    });
  };

  const getConfig = () => {
    return { ...internalConfig };
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

  const renderGlobalStyle = (getCss: GetSingleCss<Context>) => {
    return _renderGlobalStyle(internalConfig, getCss);
  };

  return {
    setConfig,
    getConfig,
    styled,
    cloneAs,
    keyframes,
    counterStyle,
    renderGlobalStyle,
  };
}
