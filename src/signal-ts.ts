export * from './signal/types'

import { emit, select, stopIf, stop, passIf, passUnique, count } from './signal/tools'
import { ifFn, ifNot } from './signal/if'
import { chain, sidechain } from './signal/chain'
import { connect as connectPrimitive, create as createPrimitive, setConfig } from './signal/primitive'
import { key } from './signal/object'
import { log, effect } from './signal/effect'
import { awaitParallel, awaitLatest, awaitOrder, awaitQueue, awaitBlock } from './signal/async'
// import { createSolid, fromSolid, listenSolid } from './signal/solid'
import { collect, buffer, window } from './signal/collect'
import { each } from './signal/each'
import { combine } from './signal/combine'
import { maybeKey, maybeSelect } from './signal/maybe'
import { connect } from './signal/connect'
import { evaluateAsync, evaluateSync } from './signal/evaluate'
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

const assert = {
  isNothing,
  isNumber,
  isArray,
  isBoolean,
  isString,
  isFunction,
  isObject,
  isError,
  create: createAssert,
  not: {
    isNothing: isNotNothing,
    isNumber: isNotNumber,
    isArray: isNotArray,
    isBoolean: isNotBoolean,
    isString: isNotString,
    isFunction: isNotFunction,
    isObject: isNotObject,
    isError: isNotError,
    create: createAssertNot,
  }
}

const maybe = {
  select: maybeSelect,
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

const evaluate = {
  sync: evaluateSync,
  async: evaluateAsync
}

// const solid = {
//   create: createSolid,
//   listen: listenSolid,
//   primitive: fromSolid,
// }

export default {
  config: setConfig,

  // namespces
  primitive,
  listen,
  await: awaitFns,
  assert,
  maybe,
  evaluate,

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
  // missing:
  // debounce
  // throttle
  // interval
}

