import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fnv1a from '@sindresorhus/fnv1a';
import { create } from '..';
import pretty from 'pretty';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const { styled } = create({
  hashFn,
});

test('No css - null', () => {
  const Button = styled('button', () => null);

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();

  expect(
    pretty(renderToStaticMarkup(<Button css={() => null} />)),
  ).toMatchSnapshot();
});

test('No css - string', () => {
  const Button = styled('button', () => 'hi');

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();
});

test('No css - boolean', () => {
  const Button = styled('button', () => true);
  const Button2 = styled('button', () => false);

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();
  expect(pretty(renderToStaticMarkup(<Button2 />))).toMatchSnapshot();
});

test('No css - nullish', () => {
  const Button = styled('button', () => null);
  const Button2 = styled('button', () => undefined);

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();
  expect(pretty(renderToStaticMarkup(<Button2 />))).toMatchSnapshot();
});
