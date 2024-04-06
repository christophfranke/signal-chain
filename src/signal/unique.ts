import { ChainCall, chain } from "./chain"
import type { Chain, SyncChain, NextFn } from "./types"
import { execute } from "./util"

/**
 * Passes the value if it is different from the last value
 */
export function passUnique<V>(): SyncChain<V> {
  return (next: NextFn<V>, parameter: V, context, status: any) => {
    if (context.last !== parameter) {
      context.last = parameter

      execute(context.cleanup)
      next(parameter)
    }

    status.is = 'incomplete'

    return final => {
      if (final) {
        execute(context.cleanup)
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
  return (next, param, context, status) =>
    chained((value) => {
      if (context.last !== value) {
        context.last = value

        execute(context.cleanup)
        context.cleanup = next(value)
      }

      return final => {
        if (final) {
          execute(context.cleanup)
        }
      }
    }, param, context, status)
}