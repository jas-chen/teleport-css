import { renderProcessedStyle } from './renderProcessedStyle';
import { toStyles } from './toStyles';
import type { Config, GetCss, RenderResult } from './types';

export function renderCss<Context>(
  config: Config<Context>,
  getCss: GetCss<Context>,
): RenderResult {
  return renderProcessedStyle(config, toStyles(config, getCss));
}
