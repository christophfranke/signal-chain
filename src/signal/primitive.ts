import type { NextFn, ListenerDescription, CleanupExec, PrimitiveSignal, PrimitiveReadonly, AnyChain, SyncChain } from './types'
import { chain } from './chain'
import { execute } from './util'


// TODO: differentiate between the chains
export interface ConnectCall {
  <V1, V2>(element1: SyncChain<V1, V2>): PrimitiveReadonly<V2>
  <V1, V2, V3>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>): PrimitiveReadonly<V3>
  <V1, V2, V3, V4>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>): PrimitiveReadonly<V4>
  <V1, V2, V3, V4, V5>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>): PrimitiveReadonly<V5>
  <V1, V2, V3, V4, V5, V6>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>): PrimitiveReadonly<V6>
  <V1, V2, V3, V4, V5, V6, V7>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>): PrimitiveReadonly<V7>
  <V1, V2, V3, V4, V5, V6, V7, V8>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>): PrimitiveReadonly<V8>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>): PrimitiveReadonly<V9>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>): PrimitiveReadonly<V10>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>): PrimitiveReadonly<V11>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>): PrimitiveReadonly<V12>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>): PrimitiveReadonly<V13>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>): PrimitiveReadonly<V14>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>, element14: SyncChain<V14, V15>): PrimitiveReadonly<V15>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>, element14: SyncChain<V14, V15>, element15: SyncChain<V15, V16>): PrimitiveReadonly<V16>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>, element14: SyncChain<V14, V15>, element15: SyncChain<V15, V16>, element16: SyncChain<V16, V17>): PrimitiveReadonly<V17>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>, element14: SyncChain<V14, V15>, element15: SyncChain<V15, V16>, element16: SyncChain<V16, V17>, element17: SyncChain<V17, V18>): PrimitiveReadonly<V18>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>, element14: SyncChain<V14, V15>, element15: SyncChain<V15, V16>, element16: SyncChain<V16, V17>, element17: SyncChain<V17, V18>, element18: SyncChain<V18, V19>): PrimitiveReadonly<V19>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19, V20>(element1: SyncChain<V1, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>, element12: SyncChain<V12, V13>, element13: SyncChain<V13, V14>, element14: SyncChain<V14, V15>, element15: SyncChain<V15, V16>, element16: SyncChain<V16, V17>, element17: SyncChain<V17, V18>, element18: SyncChain<V18, V19>, element19: SyncChain<V19, V20>): PrimitiveReadonly<V20>

  <V1, V2>(element1: AnyChain<V1, V2>): PrimitiveReadonly<V2 | undefined>
  <V1, V2, V3>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>): PrimitiveReadonly<V3 | undefined>
  <V1, V2, V3, V4>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>): PrimitiveReadonly<V4 | undefined>
  <V1, V2, V3, V4, V5>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>): PrimitiveReadonly<V5 | undefined>
  <V1, V2, V3, V4, V5, V6>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>): PrimitiveReadonly<V6 | undefined>
  <V1, V2, V3, V4, V5, V6, V7>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>): PrimitiveReadonly<V7 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>): PrimitiveReadonly<V8 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>): PrimitiveReadonly<V9 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>): PrimitiveReadonly<V10 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>): PrimitiveReadonly<V11 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>): PrimitiveReadonly<V12 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>): PrimitiveReadonly<V13 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>): PrimitiveReadonly<V14 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>, element14: AnyChain<V14, V15>): PrimitiveReadonly<V15 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>, element14: AnyChain<V14, V15>, element15: AnyChain<V15, V16>): PrimitiveReadonly<V16 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>, element14: AnyChain<V14, V15>, element15: AnyChain<V15, V16>, element16: AnyChain<V16, V17>): PrimitiveReadonly<V17 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>, element14: AnyChain<V14, V15>, element15: AnyChain<V15, V16>, element16: AnyChain<V16, V17>, element17: AnyChain<V17, V18>): PrimitiveReadonly<V18 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>, element14: AnyChain<V14, V15>, element15: AnyChain<V15, V16>, element16: AnyChain<V16, V17>, element17: AnyChain<V17, V18>, element18: AnyChain<V18, V19>): PrimitiveReadonly<V19 | undefined>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19, V20>(element1: AnyChain<V1, V2>, element2: AnyChain<V2, V3>, element3: AnyChain<V3, V4>, element4: AnyChain<V4, V5>, element5: AnyChain<V5, V6>, element6: AnyChain<V6, V7>, element7: AnyChain<V7, V8>, element8: AnyChain<V8, V9>, element9: AnyChain<V9, V10>, element10: AnyChain<V10, V11>, element11: AnyChain<V11, V12>, element12: AnyChain<V12, V13>, element13: AnyChain<V13, V14>, element14: AnyChain<V14, V15>, element15: AnyChain<V15, V16>, element16: AnyChain<V16, V17>, element17: AnyChain<V17, V18>, element18: AnyChain<V18, V19>, element19: AnyChain<V19, V20>): PrimitiveReadonly<V20 | undefined>

  (listen1: AnyChain<unknown, unknown>, ...additionalListeners: AnyChain<unknown, unknown>[]): PrimitiveReadonly<unknown>
}

export const connect: ConnectCall = (listen1: AnyChain<any, any>, ...additionalListeners: AnyChain<any, any>[]): PrimitiveReadonly<any> => {
  const chained = chain(listen1, ...additionalListeners) as AnyChain<void, any>
  let currentValue: any
  let listeners: ListenerDescription<any>[] = []
  const applyListeners = () => {
    listeners.forEach(listener => {
      execute(listener.cleanup)
      listener.cleanup = listener.fn(currentValue)
    })
  }

  const listen = (fn: NextFn<any>): CleanupExec => {
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

  const context = {}
  const status = { is: 'sync' } as any
  let unsubscribe = [
    chained((value: any) => {
      currentValue = value
      applyListeners()
    }, undefined, context, status)
  ]

  const disconnect = () => {
    execute(unsubscribe, true)
    execute(listeners.map(listener => listener.cleanup))
    listeners = []
  }

  return {
    listen,
    disconnect,
    get value() {
      return currentValue
    }
  }
}
type UpdateMethods = 'sync' | 'microtask' | 'timeout'
type Config = {
  batch?: boolean
  update?: UpdateMethods
}
type DefaultConfig = {
  batch: boolean
  update: UpdateMethods
}

const defaultConfig: DefaultConfig = {
  batch: true,
  update: 'microtask',
}
type ReadonlyConfig = {
  readonly batch: boolean,
  readonly update: UpdateMethods
}

const updateMethod = (config: Config): UpdateMethods => {
  return config.update ?? defaultConfig.update
}

const batchMethod = (config: Config) => {
  return (updateMethod(config) !== 'sync') && (config.batch ?? defaultConfig.batch)
}

export const setConfig = (config?: Config) => {
  if (config) {
    Object.assign(defaultConfig, config)
  }

  return defaultConfig as ReadonlyConfig
}

export const create = <V>(initialValue: V, config: Config = {}): PrimitiveSignal<V> => {
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

  const applyListeners = () => {
    listeners.forEach(listener => {
      execute(listener.cleanup)
      listener.cleanup = listener.fn(currentValue)
    })
  }

  const update = () => {
    const batched = batchMethod(config)
    const method = updateMethod(config)
    switch(method) {
      case 'sync':
        applyListeners()
        break
      case 'microtask':
        if (!queuedUpdate || !batched) {
          queuedUpdate++
          queueMicrotask(() => {
            queuedUpdate--
            applyListeners()
          })
        }
        break
      case 'timeout':
        if (!queuedUpdate || !batched) {
          queuedUpdate++
          setTimeout(() => {
            queuedUpdate--
            applyListeners()
          })
        }
        break
      default:
        let x: never = method
        throw new Error(`Unknown update method: ${x}`)
    }
  }

  const disconnect = () => {
    listeners.forEach(listener => {
      execute(listener.cleanup, true)
      listener.cleanup = null
    })
    listeners = []
    disconnected = true
  }

  return {
    listen,
    update: (...args: [a?: V]) => {
      if (args.length > 0) {
        setValue(args[0]!)
      }
      update()
    },
    disconnect,
    get value() {
      return currentValue
    },
    set value(value: V) {
      setValue(value)
      update()
    }
  }
}
