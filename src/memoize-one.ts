import areInputsEqual from './are-inputs-equal';

export type EqualityFn = (newArgs: unknown[], lastArgs: unknown[]) => boolean;

export function memoizeOne<
  // Need to use 'any' rather than 'unknown' here as it has
  // The correct Generic narrowing behaviour.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResultFn extends (this: any, ...newArgs: any[]) => ReturnType<ResultFn>
>(resultFn: ResultFn, isEqual: EqualityFn = areInputsEqual): ResultFn {
  let lastThis: unknown;
  let lastArgs: unknown[] = [];
  let lastResult: ReturnType<ResultFn>;
  let calledOnce: boolean = false;

  // breaking cache when context (this) or arguments change
  function memoized(this: unknown, ...newArgs: unknown[]): ReturnType<ResultFn> {
    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult;
    }

    // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
    // Doing the lastResult assignment first so that if it throws
    // nothing will be overwritten
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }

  return memoized as ResultFn;
}

export default memoizeOne;