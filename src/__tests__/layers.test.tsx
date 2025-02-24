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
  defaultLayer: 'utilities',
});

test('can set default layer', () => {
  const Button = styled('button', () => ({
    color: 'red',
    background: 'blue',
  }));

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();
});

test('CSS in layers should not be atomic', () => {
  const Button = styled('button', () => ({
    color: 'red',
    '@layer component': {
      opacity: 1,
      position: 'relative',
      '&:hover': {
        color: 'blue',
        opacity: 0.5,
      },
    },
  }));

  expect(pretty(renderToStaticMarkup(<Button />))).toMatchSnapshot();
});

test('CSS layers composition - 1', () => {
  const ButtonA = styled('button', () => ({
    '@layer component': {
      opacity: 1,
      position: 'relative',
    },
  }));

  const ButtonB = styled('button', () => ({
    '@layer component': {
      opacity: 0.5,
      position: 'static',
    },
  }));

  const ButtonC = styled(ButtonB, () => ({
    '@layer component': {
      opacity: 1,
      position: 'relative',
    },
  }));

  expect(
    pretty(
      renderToStaticMarkup(
        <div>
          <ButtonA />
          <ButtonC />
        </div>,
      ),
    ),
  ).toMatchSnapshot();
});

test('CSS layers composition - 2', () => {
  const ButtonA = styled('button', () => ({
    '@layer component.test': {
      opacity: 1,
      position: 'relative',
    },
  }));

  const ButtonB = styled('button', () => ({
    '@layer component': {
      opacity: 0.5,
      position: 'static',
    },
  }));

  const ButtonC = styled(ButtonB, () => ({
    '@layer component.test': {
      opacity: 1,
      position: 'relative',
    },
  }));

  expect(
    pretty(
      renderToStaticMarkup(
        <div>
          <ButtonA />
          <ButtonC />
        </div>,
      ),
    ),
  ).toMatchSnapshot();
});
