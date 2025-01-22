import { Config } from './types';

export const defaultPrefix = 'x';

export function getPrefix<Context>(config: Config<Context>) {
  return `${config.prefix || defaultPrefix}-`;
}
