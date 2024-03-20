import type { NextFn, ListenerDescription, CleanupExec, BasicSignal, BasicComputed, Chain } from './types'
import { chain } from './chain'
import { execute } from './util'

type UpdateMethods = 'microtask' | 'timeout' | 'immediate'
const UPDATE_METHOD = 'microtask' as UpdateMethods

type BatchMethods = 'none' | 'assignment' | 'all'
const BATCHING = 'assignment' as BatchMethods

if (UPDATE_METHOD === 'immediate' && BATCHING != 'none') {
  throw new Error('Cannot batch updates with immediate update method')
}

export interface ConnectCall {
  <V1, V2>(element1: Chain<V1, V2>): BasicComputed<V2>
  <V1, V2, V3>(element1: Chain<V1, V2>, element2: Chain<V2, V3>): BasicComputed<V3>
  <V1, V2, V3, V4>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>): BasicComputed<V4>
  <V1, V2, V3, V4, V5>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>): BasicComputed<V5>
  <V1, V2, V3, V4, V5, V6>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>): BasicComputed<V6>
  <V1, V2, V3, V4, V5, V6, V7>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>): BasicComputed<V7>
  <V1, V2, V3, V4, V5, V6, V7, V8>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>): BasicComputed<V8>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>): BasicComputed<V9>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>): BasicComputed<V10>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>): BasicComputed<V11>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>): BasicComputed<V12>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>): BasicComputed<V13>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>): BasicComputed<V14>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>): BasicComputed<V15>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>): BasicComputed<V16>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>): BasicComputed<V17>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>, element17: Chain<V17, V18>): BasicComputed<V18>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>, element17: Chain<V17, V18>, element18: Chain<V18, V19>): BasicComputed<V19>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19, V20>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>, element17: Chain<V17, V18>, element18: Chain<V18, V19>, element19: Chain<V19, V20>): BasicComputed<V20>

  (listen1: Chain<unknown, unknown>, ...additionalListeners: Chain<unknown, unknown>[]): BasicComputed<unknown>
}

export const connect: ConnectCall = (listen1: Chain<any, any>, ...additionalListeners: Chain<any, any>[]): BasicComputed<any> => {
  const chained = chain(listen1, ...additionalListeners) as Chain<void, any>
  let currentValue: any
  const context = {}
  let unsubscribe = [
    chained((value: any) => {
      currentValue = value
    }, undefined, context)
  ]

  const listen = (fn: NextFn<any>): CleanupExec => {
    const remove = chained(fn, undefined, context)
    unsubscribe.push(remove)

    return () => {
      execute(remove, true)
      unsubscribe = unsubscribe.filter(other => other !== remove)
    }
  }

  const disconnect = () => {
    currentValue = undefined as any
    execute(unsubscribe, true)
  }

  return {
    listen,
    disconnect,
    get value() {
      return currentValue
    }
  }
}


export const create = <V>(initialValue: V): BasicSignal<V> => {
  let disconnected = false
  let queuedUpdate = 0
  let currentValue = initialValue
  let listeners: ListenerDescription<V>[] = []

  const listen = (fn: NextFn<V>): CleanupExec => {
    if (disconnected) {
      return
    }
    const listener = {
      cleanup: fn(currentValue),
      fn
    }

    listeners.push(listener)

    return () => {
      execute(listener.cleanup, true)
      listener.cleanup = null
      listeners = listeners.filter(other => other !== listener)
    }
  }

  const setValue = (newValue: V) => {
    if (!disconnected) {
      currentValue = newValue
    }
  }

  const applyListeners = (value: V) => {
    listeners.forEach(listener => {
      execute(listener.cleanup)
      // this could be not optimal,
      // maybe we should use currenetValue to update here instead
      listener.cleanup = listener.fn(value)
    })
  }

  const update = (value: V) => {
    switch(UPDATE_METHOD) {
      case 'immediate':
        applyListeners(value)
        break
      case 'microtask':
        queuedUpdate++
        queueMicrotask(() => {
          queuedUpdate--
          applyListeners(value)
        })
        break
      case 'timeout':
        if (queuedUpdate === 0) {
          queuedUpdate++
          setTimeout(() => {
            queuedUpdate--
            applyListeners(value)
          })
        }
        break
      default:
        let x: never = UPDATE_METHOD
        throw new Error(`Unknown update method: ${x}`)
    }
  }

  const disconnect = () => {
    listeners.forEach(listener => {
      execute(listener.cleanup, true)
      listener.cleanup = null
    })
    listeners = []
    currentValue = undefined as V
    disconnected = true
  }

  return {
    listen,
    update: (value: V) => {
      setValue(value)
      if (queuedUpdate === 0 || BATCHING != 'all') {
        update(value)
      }
    },
    disconnect,
    get value() {
      return currentValue
    },
    set value(value) {
      setValue(value)
      if (queuedUpdate === 0 || BATCHING === 'none') {
        update(value)
      }
    }
  }
}
