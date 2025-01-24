import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MouseEvent } from 'react';
import fnv1a from '@sindresorhus/fnv1a';
import { create } from '..';
import pretty from 'pretty';

function hashFn(value: string) {
  return fnv1a(value, { size: 64 }).toString(36).slice(0, 8);
}

const { styled, cloneAs } = create({
  hashFn,
});

test('can clone style', () => {
  const Button = styled('button', () => ({
    color: 'red',
    background: 'blue',
  }));

  const Link = cloneAs(Button, 'a');

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
          <Link
            onClick={
              // test typing
              (e: MouseEvent<HTMLAnchorElement>) => {
                console.log(e);
              }
            }
          />
        </div>,
      ),
    ),
  ).toMatchSnapshot();
});
