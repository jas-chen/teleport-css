import type { ProcessedStyle, RenderResult, Config } from './types';

export function renderProcessedStyle<Context>(
  config: Config<Context>,
  styles: Readonly<ProcessedStyle[]>,
): RenderResult {
  const groupCount: Record<string, number> = {};
  const classNames: string[] = [];

  const element = (
    <>
      {styles.map((style) => {
        const { hash, group, code } = style;
        const { postProcessor } = config;

        if (group === '@') {
          return (
            <style key={hash} href={hash} precedence="0">
              {postProcessor ? postProcessor(code) : code}
            </style>
          );
        }

        let precedence: number | undefined = undefined;
        precedence = (groupCount[group] || 0) + 1;
        groupCount[group] = precedence;

        const finalHash = `${hash}-${precedence}`;
        classNames.push(finalHash);
        const classSel = `.${finalHash}`;
        const finalCode = `${classSel}${code}`;

        return (
          <style
            key={finalHash}
            href={finalHash}
            precedence={
              precedence === undefined ? undefined : String(precedence)
            }
          >
            {postProcessor ? postProcessor(finalCode) : finalCode}
          </style>
        );
      })}
    </>
  );

  return [element, classNames.join(' ')];
}
