# split-lazy 🗡🦭

This package provides ways to split arrays, strings or other iterables (sync and async) lazily. It returns an iterable that calculates the result lazily (while iterating on it).

[👉 Learn more about iterators here.][iterators]

## Installing

Use `yarn` or `npm` to install it.

```
npm install split-lazy
```

## `splitLazy`

```ts
export function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: T
): Generator<I[], void, void>;
export function splitLazy<I, T extends Iterable<I>>(
  iterable: T,
  separator: I
): Generator<I[], void, void>;
```

First argument is iterable to search inside and split. Second argument is either an iterable or an element to look for in the given first argument.

### Examples

```ts
import { splitLazy } from "split-lazy";

const arr = [1, 3, 5, 7, 9];
const result = splitLazy(arr, 5);

for (const item of result) {
    console.log(item);
}
// outputs:
// [1, 3]
// [7, 9]
```

```ts
import { splitLazy } from "split-lazy";

const arr = [1, 3, 5, 7, 9];
const iterable = splitLazy(arr, 5);

expect(iterable.next().value).toEqual([1, 3]); // ✅
expect(iterable.next().value).toEqual([7, 9]); // ✅
```

```ts
import { splitLazy } from "split-lazy";

function* generator() {
    yield 1;
    yield 3;
    yield 5;
    yield 7;
    yield 9;
}

const iterable = generator();
const result = splitLazy(iterable, 5);

for (const item of result) {
    console.log(item);
}
// outputs:
// [1, 3]
// [7, 9]
```

It can also search for sub-iterables in iterables:

```ts
import { splitLazy } from "split-lazy";

const arr = [1, 3, 5, 7, 9, 11];
const iterable = splitLazy(arr, [5, 7]);

expect(iterable.next().value).toEqual([1, 3]); // ✅
expect(iterable.next().value).toEqual([9, 11]); // ✅
```

## `asyncSplitLazy`

```ts
export function asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: T
): AsyncGenerator<I[], void, unknown>;
export function asyncSplitLazy<I, T extends AsyncIterable<I>>(
  iterable: T,
  separator: I
): AsyncGenerator<I[], void, unknown>;
```

Same applies for `AsyncIterable<T>`. Note that if you provide an `AsyncIterable<T>` instead of `T` (an element) as a separator, `asyncSplitLazy` fully serializes it into an array before it starts searching for it in the first argument (`iterable`).

## Contributing

Help is needed for documentation in general. Adding/improving TSDoc, a better README, added/improved reference would be amazing 💫. Please open/find an issue to discuss. 

## Tests

Jest tests are set up to run with `npm test`.

[iterators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators