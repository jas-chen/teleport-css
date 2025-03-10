# Documentation

## Table of Contents

- [Setup](#setup)
- [`styled`](#styled)
  - [Basic Example](#basic-example)
  - [Fallback Styles](#fallback-styles)
  - [Overriding Styles with `css`](#overriding-styles-with-css)
- [`cloneAs`](#cloneas)
- [`keyframes`](#keyframes)
- [`counterStyle`](#counterstyle)
- [`setConfig`](#setconfig)
- [`getConfig`](#getconfig)
- [`renderGlobalStyle`](#renderglobalstyle)
- [`renderCss`](#rendercss)
- [Cascade layers](#cascade-layers)
  - [`defaultLayer`](#defaultlayer)

## Setup

First, create a file named `css.ts` in a convenient location within your project.

```ts
import { create } from 'teleport-css';
// Use your preferred hash algorithm
import fnv1a from '@sindresorhus/fnv1a';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const {
  setConfig,
  getConfig,
  styled,
  cloneAs,
  keyframes,
  counterStyle,
  renderCss,
} = create({
  hashFn,
  // Optional prefix for class names and variables (default: 'x')
  // prefix?: string;

  // Optional context for creating CSS objects
  // context?: Context;

  // Optional default cascade layer name
  // defaultLayer?: string;
});

export {
  setConfig,
  getConfig,
  styled,
  cloneAs,
  keyframes,
  counterStyle,
  renderCss,
};
```

## `styled`

The `styled` function is the core of this library, enabling the creation of styled components.

The output selectors remain unaltered (no merging occurs). For more details on the syntax, please refer to [CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting).

### Basic Example

```tsx
import { styled } from 'path/to/css';

const Button = styled('button', (context) => ({
  backgroundColor: 'pink',
  '&:hover': {
    backgroundColor: 'lemonchiffon',
  },
}));

// You can also style a styled component
const PrimaryButton = styled(Button, (context) => ({
  backgroundColor: 'lightblue',
}));
```

### Fallback Styles

Define fallbacks for browsers that don't support specific features.

```tsx
import { styled } from 'path/to/css';

const Text = styled('span', (context) => ({
  // Fallback to `#ffb0e9` for browsers without oklch support
  color: '#ffb0e9;color:oklch(95%, 0.2, 0)',
}));
```

### Overriding Styles with `css`

The `css` prop allows you to override or extend styles dynamically.

> The `css` prop is ideal for handling dynamic styling, such as styles based on user input. Unlike `styled`, which processes CSS objects once and caches the result for better performance, the `css` prop processes CSS objects on every render. While the `css` prop is flexible, `styled` is faster and should be your first choice whenever possible.

```tsx
function App() {
  return (
    <Button
      css={(context) => ({
        backgroundColor: 'gold',
      })}
    >
      Gold
    </Button>
  );
}
```

## `cloneAs`

The `cloneAs` function allows you to clone an existing styled component and render it as a different element.

```ts
import { cloneAs } from 'path/to/css';

const Link = cloneAs(Button, 'a');
```

## `keyframes`

Create CSS animations using the `keyframes` function.

```ts
import { keyframes } from 'path/to/css';

const spin = keyframes((context) => ({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
}));

const Button = styled('button', (context) => ({
  // It must be converted to a string inside the function.
  animation: `${spin} 1s ease infinite`,
}));

// Alternative syntax
const AnotherButton = styled('button', (context) => ({
  // It must be converted to a string inside the function.
  animationName: `${spin}`,
}));
```

## `counterStyle`

Define custom list styles using the `counterStyle` function.

```ts
import { counterStyle } from 'path/to/css';

const thumbs = counterStyle((context) => ({
  system: 'cyclic',
  symbols: '"\1F44D"',
  suffix: '" "',
}));

const List = styled('ul', (context) => ({
  // It must be converted to a string inside the function.
  listStyle: `${thumbs}`,
}));
```

## `setConfig`

Use the `setConfig` function to update the configuration dynamically. Ensure this function is called **before rendering components** for the changes to take effect.

> The config object is **not** passed through [React Context](https://react.dev/learn/passing-data-deeply-with-context) because React Context is not supported in Server Components; instead, it is provided as a singleton.

```ts
import { setConfig } from 'path/to/css';

setConfig({
  prefix: 'z',
});
```

## `getConfig`

Retrieve the current configuration using the `getConfig` function.

```ts
import { getConfig } from 'path/to/css';

function Button(props: React.ComponentProps<'button'>) {
  return (
    <button className={`${getConfig().prefix}-Button`} {...props} />
  )
}
```

## `renderGlobalStyle`

Define global styles using the `renderGlobalStyle` function.

```tsx
import { renderGlobalStyle } from 'path/to/css';

function App() {
  const globalStyle = renderGlobalStyle((context) => ({
    ':root': {
      '--black': '#000',
    },
    body: {
      color: 'var(--black)',
    },
  }));

  return <>{globalStyle}</>;
}
```

## `renderCss`

Low level API to create styles. Please refer to [src/styled.tsx](../src/styled.tsx) for the usage.

## Cascade layers

CSS within cascade layers will not be converted to atomic CSS.

> NOTE: This behavior does not require `defaultLayer` to be configured.

```tsx
const { styled } = create({
  hashFn,
});

const Button = styled('button', () => ({
  '@layer component': {
    opacity: 1,
    position: 'relative',
  },
}));

/** Output

.x_2dj17gws1 {
  @layer component {
    opacity: 1;
    position: relative
  }
}

*/
```

### `defaultLayer`

You can set the default layer name using the `defaultLayer` setting.

```tsx
const { styled } = create({
  hashFn,
  defaultLayer: 'utilities',
});

const Button = styled('button', () => ({
  color: 'red',
  background: 'blue',
}));

/** Output

.x_4tcsx9ze1 {
  @layer utilities {
    color: red
  }
}

.x_1fwwk7jh1 {
  @layer utilities {
    background: blue
  }
}

*/
```
