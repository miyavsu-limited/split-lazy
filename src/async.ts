import { isAsyncIterable, isIterable } from './utils';

export async function* asyncSplitLazyWithSeparator<
  I,
  T extends AsyncIterable<I>
>(iterable: T, separator: I) {
  let yieldNext: I[] = [];

  for await (const item of iterable) {
    if (item === separator) {
      yield yieldNext;
      yieldNext = [];
    } else {
      yieldNext.push(item);
    }
  }

  yield yieldNext;
}

export async function* asyncSplitLazyWithSubIterator<
  I,
  T extends AsyncIterable<I>
>(iterable: T, subIterable: Iterable<unknown> | AsyncIterable<unknown>) {
  let yieldNext: I[] = [];
  let subIterableItems = [];

  if (isAsyncIterable(subIterable) || isIterable(subIterable)) {
    for await (const item of subIterable) {
      subIterableItems.push(item);
    }
  }

  let foundSubIterator = 0;

  for await (const item of iterable) {
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
          subIterableItems.slice(0, foundSubIterator) as ConcatArray<I>
        );

        foundSubIterator = 0;
      }

      yieldNext.push(item);
    }
  }

  yield yieldNext;
}

export async function* asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: unknown
): AsyncGenerator<I[], void, void> {
  if (isAsyncIterable(separator) || isIterable(separator)) {
    for await (const value of asyncSplitLazyWithSubIterator(
      iterable,
      separator
    )) {
      yield value as I[];
    }
  } else {
    for await (const value of asyncSplitLazyWithSeparator(
      iterable,
      separator
    )) {
      yield value as I[];
    }
  }
}
