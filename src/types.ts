import { CSSProperties, ReactElement } from 'react';

export type CSSObject = CSSProperties & {
  [Key: string]:
    | CSSObject
    | CSSObject[]
    | string
    | number
    | boolean
    | undefined;
};

export interface Style {
  parents?: string[];
  name: string;
  value: string | number;
}

export interface ProcessedStyle {
  group: string;
  hash: string;
  code: string;
}

export type RenderResult = [style: ReactElement, className: string];

export interface Config<Context> {
  hashFn: (value: string) => string;
  context?: Context;
  prefix?: string;
  postProcessor?: (code: string) => string;
}

export type GetCss<Context> = (context: Context) => CSSObject | CSSObject[];
export type GetSingleCss<Context> = (context: Context) => CSSObject;
