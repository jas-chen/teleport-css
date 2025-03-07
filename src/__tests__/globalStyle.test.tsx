import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fnv1a from '@sindresorhus/fnv1a';
import { create } from '..';
import pretty from 'pretty';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const { renderGlobalStyle } = create({
  hashFn,
});

test('can define animation with objects', () => {
  const globalStyle = renderGlobalStyle(() => ({
    ':root': {
      '--black': '#000',
    },
    body: {
      main: {
        color: 'var(--black)',
      },
    },
  }));

  expect(pretty(renderToStaticMarkup(globalStyle))).toMatchSnapshot();
});

test('can define animation with arrays', () => {
  const globalStyle = renderGlobalStyle(() => [
    {
      ':root': {
        '--black': '#000',
      },
    },
    {
      body: {
        main: {
          color: 'var(--black)',
        },
      },
    },
  ]);

  expect(pretty(renderToStaticMarkup(globalStyle))).toMatchSnapshot();
});

test('no css', () => {
  const globalStyle = renderGlobalStyle(() => null);

  expect(pretty(renderToStaticMarkup(globalStyle))).toMatchSnapshot();
});
