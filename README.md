<a href="https://www.npmjs.com/package/teleport-css"><img alt="npm version" src="https://badgen.net/npm/v/teleport-css"></a>
<a href="https://bundlephobia.com/package/teleport-css"><img alt="bundle size" src="https://badgen.net/bundlephobia/minzip/teleport-css"></a>

# Teleport CSS

## Features

- **Plug-and-Play**: Works out of the box—no need for bundler or PostCSS configuration.
- **React Server Components (RSC) Support**: Seamlessly integrates with [React Server Components](https://react.dev/reference/rsc/server-components).
- **Streaming Support**: Compatible with [React's streaming rendering](https://react.dev/reference/react-dom/server/renderToPipeableStream).
- **Atomic CSS, Minus the Pitfalls**: Achieve atomic CSS with ease, avoiding common issues \[[1](https://play.tailwindcss.com/9XhuiUFF6n)]\[[2](https://play.panda-css.com/269sbigMXM)].
- **Optimized for Component Libraries**: Specifically designed to streamline the creation of reusable component libraries.

## Prerequisites

- React 19

## Installation

```
npm i teleport-css
```

## Usage

```tsx
import { create } from 'teleport-css';
// Use whatever hash algorithm you like
import fnv1a from '@sindresorhus/fnv1a';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const { styled, keyframes, cloneAs } = create({
  hashFn,
  context: {
    breakpoints: {
      md: '768px',
    },
  },
});

const animation = keyframes((context) => ({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
}));

const Button = styled('button', (context) => ({
  animation: `${animation} 1s ease infinite`,
  backgroundColor: 'pink',
  [`@media (width >= ${context.breakpoints.md})`]: {
    backgroundColor: 'gold',
  },
}));

const ButtonAsLink = cloneAs(Button, 'a');

function App() {
  return (
    <>
      <Button
        type="button"
        css={(context) => ({
          '&:hover': {
            backgroundColor: 'lemonchiffon',
          },
        })}
      >
        Test
      </Button>
      <ButtonAsLink href="/">Home</ButtonAsLink>
    </>
  );
}
```

## Documentation

See [docs](/docs).

## Browser support

Browsers support `CSS Nesting` ([Baseline 2023](https://caniuse.com/css-nesting)).

## License

MIT
