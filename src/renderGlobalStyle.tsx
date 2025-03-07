import { cssToString } from './cssToString';
import type { Config, CreateCss } from './types';

export function renderGlobalStyle<Context>(
  config: Config<Context>,
  createCss: CreateCss<Context>,
) {
  const code = cssToString(createCss(config.context!));

  if (!code) {
    return null;
  }

  return (
    <>
      <style precedence="-1" href={config.hashFn(code)}>
        {code}
      </style>
      <style precedence="0" href="$0" />
      <style precedence="1" href="$1" />
    </>
  );
}
