export * from './signal/types'

import { emit, select, stopIf, stop, passIf, passUnique, count } from './signal/tools'
import { ifFn, ifNot } from './signal/if'
import { chain, sidechain } from './signal/chain'
import { connect as connectPrimitive, create as createPrimitive, setConfig } from './signal/primitive'
import { key } from './signal/object'
import { log, effect } from './signal/effect'
import { awaitParallel, awaitLatest, awaitOrder, awaitQueue, awaitBlock } from './signal/async'
import { collect, buffer, window } from './signal/collect'
import { each } from './signal/each'
import { combine } from './signal/combine'
import { maybeKey, maybeSelect,maybeChain } from './signal/maybe'
import { connect } from './signal/connect'
import { evaluate, toFunction } from './signal/evaluate'
import { listenToEvent } from './signal/event'
import { merge } from './signal/merge'
import { assert as createAssert,
  assertNot as createAssertNot,
  isNothing,
  isNumber,
  isArray,
  isBoolean,
  isString,
  isFunction,
  isObject,
  isError,
  isNotNothing,
  isNotNumber,
  isNotArray,
  isNotBoolean,
  isNotString,
  isNotFunction,
  isNotObject,
  isNotError,
}  from './signal/assert'
import { catchFn } from './signal/catch'

export { execute } from './signal/util'

const type = {
  isNothing,
  isNumber,
  isArray,
  isBoolean,
  isString,
  isFunction,
  isObject,
  isError,
  is: createAssert,
  not: {
    isNothing: isNotNothing,
    isNumber: isNotNumber,
    isArray: isNotArray,
    isBoolean: isNotBoolean,
    isString: isNotString,
    isFunction: isNotFunction,
    isObject: isNotObject,
    isError: isNotError,
    is: createAssertNot,
  }
}

const maybe = {
  select: maybeSelect,
  chain: maybeChain,
  listen: {
    key: maybeKey
  }
}

const primitive = {
  create: createPrimitive,
  connect: connectPrimitive,
}

const awaitFns = {
  parallel: awaitParallel,
  latest: awaitLatest,
  order: awaitOrder,
  queue: awaitQueue,
  block: awaitBlock,
}

const listen = {
  key,
  event: listenToEvent,
}


const debounce = <V>(ms: number) => chain(
  select<V>(),
  type.not.isError(
    awaitFns.latest(
      select(v => new Promise<V>(resolve => setTimeout(() => resolve(v), ms))),
    ),
    type.not.isError(),
  ),
)

export default {
  config: setConfig,

  // namespces
  primitive,
  listen,
  await: awaitFns,
  type,
  maybe,
  evaluate,
  function: toFunction,

  // adapters
  // solid,

  // connectors
  connect,

  // essentials
  emit,
  select,
  effect,
  collect,
  count,
  stop,
  stopIf,
  passIf,
  catch: catchFn,
  /**
   * Chain multiple elements together. Each element can be a {@link Chain} or a {@link ConnectedChain}
   *
   * @param element1 The first chain element
   * @param element2 The second chain element
   * @param ...
   * @param elment20 The last chain element
   *
   * @returns A chain that executes all elements in order
   */
  chain,
  combine,
  each,
  merge,
  if: ifFn,
  ifNot,
  // missing:
  // while
  // cache

  // candy
  log,
  buffer,
  window,
  sidechain,
  passUnique,
  debounce,
  // missing:
  // throttle
  // interval
}

