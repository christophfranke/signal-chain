import type { NextFn, AsyncChain, SyncChain, IncompleteChain, Chain, Function1 } from './types'


/**
 * Count the number of times a signal has passed
 */
export function count<V>(): SyncChain<V, number> {
  return (next, _, context) => {
    context.count = (context.count ?? 0) + 1

    return next(context.count)
  }
}

/**
 * Emits a value
 *
 * @param parameter The value to emit
 */
export function emit<V, Input = void>(parameter: V): SyncChain<Input, V> {
  return (next: NextFn<V>) => next(parameter)
}

/**
 * Passes the value if the condition is met
 *
 * @param condition The condition to evaluate.
 */
export function passIf<V>(condition: Function1<V, boolean>): IncompleteChain<V> {
  return (next: NextFn<V>, parameter: V) => {
    if (condition(parameter)) {
      return next(parameter)
    }
  }
}

/**
 * Stops the chain if the condition is met
 *
 * @param condition The condition to evaluate.
 */
export function stopIf<V>(condition: Function1<V, boolean>): IncompleteChain<V> {
  return (next: NextFn<V>, parameter: V) => {
    if (!condition(parameter)) {
      return next(parameter)
    }
  }
}

/**
 * Passes the value if it is different from the last value
 */
export function passUnique<V>(): SyncChain<V> {
  return (next: NextFn<V>, parameter: V, context) => {
    if (context.last !== parameter) {
      context.last = parameter

      return next(parameter)
    }
  }
}

/**
 * Stops the chain
 */
export function stop<V>(): IncompleteChain<V, never> {
  return () => {}
}

/**
 * Passes the value on
 */
export function through<V>(): SyncChain<V> {
  return (fn: NextFn<V>, parameter: V) => fn(parameter)
}

/**
 * Select a value from the input.
 *
 * @param mapping A function to map the input to the output
 */
export function select<V>(): SyncChain<V>
export function select<From, To = From>(mapping: Function1<From, To>): Chain<From, To>
export function select<From, To>(mapping?: Function1<From, To>): Chain<From, To> {
  if (mapping) {
    return (fn: NextFn<To>, parameter: From) => fn(mapping(parameter))
  }

  return through() as any
}
