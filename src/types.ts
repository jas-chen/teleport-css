import { CSSProperties, ReactElement } from 'react';

export type CSSObject = CSSProperties & {
  [Key: string]: CssInput | string | number | boolean | undefined | null;
};

type CssObjectArray = (
  | CSSObject
  | CssObjectArray
  | string
  | number
  | boolean
  | undefined
  | null
)[];

export type CssInput =
  | CSSObject
  | CssObjectArray
  | string
  | number
  | boolean
  | undefined
  | null;

export interface Style {
  group: string;
  hash: string;
  code: string;
  valueLength?: number;
}

export type RenderResult = [style: ReactElement, className: string];

/**
 * Configuration options for the CSS generation.
 *
 * @template Context - The type of context to be used when creating CSS objects.
 */
export interface ConfigInput<Context> {
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
   * The default cascade layer name
   *
   * @type {string}
   */
  defaultLayer?: string;
}

// Ensure prefix exists
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
  prefix: string;

  /**
   * The context to use when creating CSS objects.
   *
   * @type {Context}
   */
  context?: Context;

  /**
   * The default cascade layer name
   *
   * @type {string}
   */
  defaultLayer?: string;
}

export type CreateCss<Context> = (context: Context) => CssInput;
export type CssProp<Context> = CreateCss<Context> | CssInput | undefined | null;
