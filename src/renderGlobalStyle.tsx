import { cssToString } from './cssToString';
import { Config, GetCss } from './types';

export function renderGlobalStyle<Context>(
  config: Config<Context>,
  getCss: GetCss<Context>,
) {
  const code = cssToString(getCss(config.context!));

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
