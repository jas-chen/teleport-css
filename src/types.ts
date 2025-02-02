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

/**
 * Configuration options for the CSS generation.
 *
 * @template Context - The type of context to be used when creating CSS objects.
 */
export interface Config<Context> {
  /**
   * The function to hash class names and other variables.
   *
   * @param {string} value - The value to be hashed.
   * @returns {string} The hashed value.
   */
  hashFn: (value: string) => string;

  /**
   * The prefix to use when creating class names and other variables.
   * Defaults to `x`.
   *
   * @type {string}
   */
  prefix?: string;

  /**
   * The context to use when creating CSS objects.
   *
   * @type {Context}
   */
  context?: Context;

  /**
   * A function to post-process the generated CSS.
   *
   * @param {string} code - The generated CSS code.
   * @returns {string} The post-processed CSS code.
   */
  postProcessor?: (code: string) => string;
}

export type GetCss<Context> = (context: Context) => CSSObject | CSSObject[];
export type GetSingleCss<Context> = (context: Context) => CSSObject;
