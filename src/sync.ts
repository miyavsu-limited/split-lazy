import { isIterable } from './utils';

export function* joinAll(iterable: Iterable<string[]>) {
  for (const el of iterable) {
    yield el.join('');
  }
}

export function* splitLazyWithSeparator<I, T extends Iterable<I>>(
  iterable: T,
  separator: I
) {
  let yieldNext: I[] = [];

  for (const item of iterable) {
    if (item === separator) {
      yield yieldNext;
      yieldNext = [];
    } else {
      yieldNext.push(item);
    }
  }

  yield yieldNext;
}

export function* splitLazyWithSubIterator<I, T extends Iterable<I>>(
  iterable: T,
  subIterable: T
) {
  let yieldNext: I[] = [];
  let subIterableItems = Array.from(subIterable);
  let foundSubIterator = 0;

  for (const item of iterable) {
    if (item === subIterableItems[foundSubIterator]) {
      if (subIterableItems.length - 1 === foundSubIterator) {
        yield yieldNext;
        yieldNext = [];
        foundSubIterator = 0;
      } else {
        foundSubIterator++;
      }
    } else {
      if (foundSubIterator > 0) {
        yieldNext = yieldNext.concat(
          subIterableItems.slice(0, foundSubIterator)
        );

        foundSubIterator = 0;
      }

      yieldNext.push(item);
    }
  }

  yield yieldNext;
}

export function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: unknown
) {
  if (isIterable(separator)) {
    return splitLazyWithSubIterator(iterable, separator);
  }

  return splitLazyWithSeparator(iterable, separator);
}

export function splitLazyString(iterable: string, separator: string) {
  return joinAll(
    splitLazyWithSubIterator(iterable, separator) as Generator<
      string[],
      void,
      void
    >
  );
}
