<a href="https://www.npmjs.com/package/teleport-css"><img alt="npm version" src="https://badgen.net/npm/v/teleport-css"></a>
<a href="https://bundlephobia.com/package/teleport-css"><img alt="bundle size" src="https://badgen.net/bundlephobia/minzip/teleport-css"></a>

# Teleport CSS

## Features

- Plug-and-play: No bundler or PostCSS configuration is required
- [React Server Components](https://react.dev/reference/rsc/server-components) (RSC) support
- [Streaming](https://react.dev/reference/react-dom/server/renderToPipeableStream) support
- Atomic CSS without footguns \[[1](https://play.tailwindcss.com/9XhuiUFF6n)]\[[2](https://play.panda-css.com/269sbigMXM)]
- Designed for creating component libraries.

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
