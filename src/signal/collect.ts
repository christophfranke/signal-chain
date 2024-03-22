import type { Chain, Function2 } from './types'

export interface CollectCall {
  /**
   * Collects all values into an array
   */
  <V1>(): Chain<V1, V1[]>
  /**
   * Collect values similar to the Array.prototype.reduce function.
   *
   * @param keep a function that will be called for each value with the current collection and the new value
   * @param initial the initial value of the collection
   */
  <V1, V2>(keep: Function2<V2, V1, V2>, initial: V2): Chain<V1, V2>
}

export const collect: CollectCall = <V1, V2>(keep?: Function2<V2, V1, V2>, initial?: V2): Chain<V1, V2> => {
  return (next, parameter, context) => {
    if (!context.isInitialized) {
      context.collection = keep ? initial : []
      context.isInitialized = true
    }


    if (keep) {
      context.collection = keep(context.collection, parameter)
    } else {
      context.collection.push(parameter)
    }

    return next(context.collection)
  }
}

/**
 * Collects [n] values into an array. The array will be reset after [n] values.
 *
 * @param size of the buffer
 */
export const buffer = <V>(size: number) => collect<V, V[]>((collection, value) => {
  collection.push(value)
  if (collection.length > size) {
    return [value]
  }
  return collection
}, [])

/**
 * Collects the last [n] values into an array.
 *
 * @param size of the window
 */
export const window = <V>(size: number) => collect<V, V[]>((collection, value) => {
  collection.push(value)
  if (collection.length > size) {
    collection = collection.slice(-size)
  }
  return collection
}, [])
