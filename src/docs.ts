export type { PrimitiveReadonly as BasicComputed, PrimitiveSignal as BasicSignal, Chain, CleanupExec, ConnectedChain} from './signal/types'

import type { Chain, ConnectedChain } from './signal-ts'

import * as tools from './signal/tools'
import { ifFn, ifNot as ifNotFn } from './signal/if'
import * as chaining from './signal/chain'

import * as effects from './signal/effect'
import * as collection from './signal/collect'
import { evaluateAsync, evaluateSync } from './signal/evaluate'
import { each as eachFn } from './signal/each'
import { combine as combineFn } from './signal/combine'
import { merge as mergeFn } from './signal/merge'
import * as connection from './signal/connect'

// import { createSolid, fromSolid, listenSolid } from './signal/solid'

import { awaitParallel, awaitLatest, awaitOrder, awaitQueue, awaitBlock } from './signal/async'
import { maybeKey, maybeSelect } from './signal/maybe'
import { listenToEvent } from './signal/event'
import { key as objectKey } from './signal/object'
import { connect as connectPrimitive, create as createPrimitive } from './signal/primitive'
import { assert as createAssert,
  assertNot as createAssertNot,
  isNothing as assertIsNothing,
  isNumber as assertIsNumber,
  isArray as assertIsArray,
  isBoolean as assertIsBoolean,
  isString as assertIsString,
  isFunction as assertIsFunction,
  isObject as assertIsObject,
  isError as assertIsError,
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

export namespace $ {
  export namespace assert {
    export const isNothing = assertIsNothing
    export const isNumber = assertIsNumber
    export const isArray = assertIsArray
    export const isBoolean = assertIsBoolean
    export const isString = assertIsString
    export const isFunction = assertIsFunction
    export const isObject = assertIsObject
    export const isError = assertIsError
    export namespace not {
      export const isNothing = isNotNothing
      export const isNumber = isNotNumber
      export const isArray = isNotArray
      export const isBoolean = isNotBoolean
      export const isString = isNotString
      export const isFunction = isNotFunction
      export const isObject = isNotObject
      export const isError = isNotError
      export const create = createAssertNot
    }
    export const create = createAssert
  }
}

export namespace $ {
  export namespace maybe {
    export const select = maybeSelect
    export namespace listen {
      export const key = maybeKey
    }
  }
}

export namespace $ {
  export namespace primitive {
    export const create = createPrimitive
    export const connect = connectPrimitive
  }
}

export namespace $ {
  export namespace await {
    export const parallel = awaitParallel
    export const latest = awaitLatest
    export const order = awaitOrder
    export const queue = awaitQueue
    export const block = awaitBlock
  }
}

export namespace $ {
  export namespace listen {
    export const key = objectKey
    export const event = listenToEvent
  }
}

export namespace $ {
  export namespace evaluate {
    export const sync = evaluateSync
    export const async = evaluateAsync
  }
}

// const solid = {
//   create: createSolid,
//   listen: listenSolid,
//   primitive: fromSolid,
// }
export namespace $ {
  export const select = tools.select
  export const count = tools.count
  export const emit = tools.emit
  export const passIf = tools.passIf
  export const stopIf = tools.stopIf
  export const passUnique = tools.passUnique
  export const stop = tools.stop

  export const $if = ifFn
  export const ifNot = ifNotFn

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
  export const chain = chaining.chain
  export const sidechain = chaining.sidechain

  export const effect = effects.effect
  export const log = effects.log

  export const connect = connection.connect


  export const combine = combineFn
  export const each = eachFn
  export const merge = mergeFn
  export const $catch = catchFn

  export const collect = collection.collect
  export const buffer = collection.buffer
  export const window = collection.window
}
