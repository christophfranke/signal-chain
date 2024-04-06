import type { NextFn, SyncChain } from './types'


export function effect<V>(sideEffect: NextFn<V>): SyncChain<V> {
  return (resolve: NextFn<V>, parameter: V) => {
    return [
      sideEffect(parameter),
      resolve(parameter),
    ]
  }
}
// log the signal at any point
export const log = <V>(...messages: any[]) => effect<V>(
  value => console.log(...(messages.length === 0 ? ['Signal.log:'] : messages), value)
)
