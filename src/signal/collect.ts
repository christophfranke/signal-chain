import type { Chain, Function2 } from './types'

export interface CollectCall {
  <V1>(): Chain<V1, V1[]>
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


export const buffer = <V>(size: number) => collect<V, V[]>((collection, value) => {
  collection.push(value)
  if (collection.length > size) {
    return [value]
  }
  return collection
}, [])

export const window = <V>(size: number) => collect<V, V[]>((collection, value) => {
  collection.push(value)
  if (collection.length > size) {
    collection = collection.slice(-size)
  }
  return collection
}, [])
