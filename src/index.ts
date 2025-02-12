import { ElementType } from 'react';
import type { ConfigInput, Config, CreateCss, CreateSingleCss } from './types';
import { styled as _styled } from './styled';
import { cloneAs as _cloneAs } from './cloneAs';
import { renderGlobalStyle as _renderGlobalStyle } from './renderGlobalStyle';
import { renderCss as _renderCss } from './renderCss';
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
    createCss: CreateCss<Context>,
  ) => {
    return _styled(internalConfig, component, createCss);
  };

  const keyframes = (createCss: CreateSingleCss<Context>) => {
    return _keyframes(internalConfig, createCss);
  };

  const counterStyle = (createCss: CreateSingleCss<Context>) => {
    return _counterStyle(internalConfig, createCss);
  };

  const cloneAs = <
    SourceComponent extends ElementType,
    NewComponent extends ElementType,
  >(
    sourceComponent: SourceComponent & {
      $createCss?: CreateCss<Context>;
    },
    newComponent: NewComponent,
  ) => {
    return _cloneAs(internalConfig, sourceComponent, newComponent);
  };

  const renderGlobalStyle = (createCss: CreateSingleCss<Context>) => {
    return _renderGlobalStyle(internalConfig, createCss);
  };

  const renderCss = (
    createStaticCss: CreateCss<Context>,
    createDynamicCss: CreateCss<Context> | undefined | null,
    additionalClassName: string | undefined | null,
  ) => {
    return _renderCss(
      internalConfig,
      createStaticCss,
      createDynamicCss,
      additionalClassName,
    );
  };

  return {
    setConfig,
    getConfig,
    styled,
    cloneAs,
    keyframes,
    counterStyle,
    renderGlobalStyle,
    renderCss,
  };
}
