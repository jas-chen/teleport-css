import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MouseEvent } from 'react';
import fnv1a from '@sindresorhus/fnv1a';
import { create } from '..';
import pretty from 'pretty';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const { styled } = create({
  hashFn,
});

test('style deduplication', () => {
  const Button = styled('button', () => ({
    color: 'red',
    background: 'blue',
  }));

  const Link = styled('a', () => ({
    color: 'yellow',
    background: 'blue',
  }));

  expect(
    pretty(
      renderToStaticMarkup(
        <div>
          <Button
            onClick={
              // test typing
              (e: MouseEvent<HTMLButtonElement>) => {
                console.log(e);
              }
            }
          />
          <Link />
        </div>,
      ),
    ),
  ).toMatchSnapshot();
});

test('no footgun', () => {
  const Last = styled('span', () => ({
    '&:first-child:after': {
      content: '"First"',
    },
    '&:last-child:after': {
      content: '"Last"',
    },
  }));

  const First = styled('span', () => ({
    '&:last-child:after': {
      content: '"Last"',
    },
    '&:first-child:after': {
      content: '"First"',
    },
  }));

  expect(
    pretty(
      renderToStaticMarkup(
        <div>
          <Last />
          <First />
        </div>,
      ),
    ),
  ).toMatchSnapshot();
});

test('CSS value fallback', () => {
  const Text = styled('span', () => ({
    color: 'color: rgba(0,0,0,0.9)',
  }));

  const TextWithFallback = styled('span', () => [
    {
      color: 'black',
    },
    {
      color: 'color: rgba(0,0,0,0.9)',
    },
  ]);

  expect(
    pretty(
      renderToStaticMarkup(
        <div>
          <TextWithFallback />
          <Text />
        </div>,
      ),
    ),
  ).toMatchSnapshot();
});
