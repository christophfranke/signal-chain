import { ChainCall, chain } from "./chain"
import type { Chain, SyncChain, NextFn, CleanupExec } from "./types"
import { execute } from "./util"

/**
 * Passes the value if it is different from the last value
 */
export function passUnique<V>(): SyncChain<V> {
  return (next: NextFn<V>, parameter: V, context, status: any) => {
    if (context.last !== parameter) {
      context.last = parameter

      execute(context.cleanup)
      context.cleanup = next(parameter)
    }

    status.is = 'incomplete'

    return final => {
      if (final) {
        execute(context.cleanup, true)
      }
    }
  }
}

export function selectUnique<V, U>(mapping: (value: V) => U): SyncChain<V, U> {
  return (next: NextFn<U>, parameter: V, context, status: any) => {
    const mappedValue = mapping(parameter)
    if (context.last !== mappedValue) {
      context.last = mappedValue

      execute(context.cleanup)
      context.cleanup = next(mappedValue)
    }

    status.is = 'incomplete'

    return final => {
      if (final) {
        execute(context.cleanup, true)
      }
    }
  }
}

// @ts-expect-error
export const uniqueValue: ChainCall = (
  first: Chain<unknown, unknown>,
  ...elements: (Chain<unknown, unknown> | undefined)[]
): Chain<unknown, unknown>  => {
  const chained = chain(first, ...elements)
  return (next, param, context, status) => {
    let last = [] as any
    let cleanup: CleanupExec
    return chained((value) => {
      if (last.length === 0 || last[0] !== value) {
        last[0] = value

        execute(cleanup)
        cleanup = next(value)
      }

      return final => {
        if (final) {
          execute(cleanup, true)
        }
      }
    }, param, context, status)
  }
}