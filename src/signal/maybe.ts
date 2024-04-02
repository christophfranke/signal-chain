import { Maybe, Function1, ConnectedChain, NextFn } from './types'

import { isNotNothing } from './assert'
import { key } from './object'

export interface MaybeKeyCall {
  <O extends Object, Key extends keyof O>(keyOf: Key): ConnectedChain<undefined, undefined>
  <O extends Object, Key extends keyof O>(keyOf: Key): ConnectedChain<null, null>
  <O extends Object, Key extends keyof O>(keyOf: Key): ConnectedChain<O | undefined, O[Key] | undefined>
  <O extends Object, Key extends keyof O>(keyOf: Key): ConnectedChain<O | null, O[Key] | null>
  <O extends Object, Key extends keyof O>(keyOf: Key): ConnectedChain<Maybe<O>, Maybe<O[Key]>>
  <O extends Object, Key extends keyof O>(keyOf: Key): ConnectedChain<O, O[Key]>
}

export const maybeKey: MaybeKeyCall = <O extends Object, Key extends keyof O>(keyOf: Key) => isNotNothing(key<O, Key>(keyOf)) as ConnectedChain<Maybe<O>, Maybe<O[Key]>>

export const maybeSelect = <V1, Filter extends V1 & (null | undefined), From extends Exclude<V1, Filter>, To>(mapping: Function1<From, To>): ConnectedChain<From | V1, To | Filter> => {
  return (resolve: NextFn<Filter | To>, value: V1 | From) => {
    if (value !== undefined && value !== null) {
      return resolve(mapping(value as any))
    }

    return resolve(value as Filter)
  }
}
