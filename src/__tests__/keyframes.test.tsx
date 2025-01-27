import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fnv1a from '@sindresorhus/fnv1a';
import { create } from '..';
import pretty from 'pretty';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const { styled, keyframes } = create({
  hashFn,
});

test('can define animation', () => {
  const spin = keyframes(() => ({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  }));

  const Button = styled('button', () => ({
    animation: `${spin} 1s ease infinite`,
  }));

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();
});
