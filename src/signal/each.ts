import type { Chain, AnyChain, SyncChain, AsyncChain, WeakChain, AsyncWeakChain, CleanupExec, } from './types'
import { chain } from './chain'
import { through } from './tools'
import { execute } from './util'

export interface EachCall {
  // sync chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'sync'>, element2?: Chain<V2, V3, 'sync'>, element3?: Chain<V3, V4, 'sync'>, element4?: Chain<V4, V5, 'sync'>, element5?: Chain<V5, V6, 'sync'>, element6?: Chain<V6, V7, 'sync'>, element7?: Chain<V7, V8, 'sync'>, element8?: Chain<V8, V9, 'sync'>, element9?: Chain<V9, V10, 'sync'>, element10?: Chain<V10, V11, 'sync'>, element11?: Chain<V11, V12, 'sync'>, element12?: Chain<V12, V13, 'sync'>, element13?: Chain<V13, V14, 'sync'>, element14?: Chain<V14, V15, 'sync'>, element15?: Chain<V15, V16, 'sync'>, element16?: Chain<V16, V17, 'sync'>, element17?: Chain<V17, V18, 'sync'>, element18?: Chain<V18, V19, 'sync'>, element19?: Chain<V19, V20, 'sync'>)
  : SyncChain<V1[], V20[]>

  // async chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'async'>, element2?: Chain<V2, V3, 'async'>, element3?: Chain<V3, V4, 'async'>, element4?: Chain<V4, V5, 'async'>, element5?: Chain<V5, V6, 'async'>, element6?: Chain<V6, V7, 'async'>, element7?: Chain<V7, V8, 'async'>, element8?: Chain<V8, V9, 'async'>, element9?: Chain<V9, V10, 'async'>, element10?: Chain<V10, V11, 'async'>, element11?: Chain<V11, V12, 'async'>, element12?: Chain<V12, V13, 'async'>, element13?: Chain<V13, V14, 'async'>, element14?: Chain<V14, V15, 'async'>, element15?: Chain<V15, V16, 'async'>, element16?: Chain<V16, V17, 'async'>, element17?: Chain<V17, V18, 'async'>, element18?: Chain<V18, V19, 'async'>, element19?: Chain<V19, V20, 'async'>)
  : AsyncChain<V1[], V20[]>

  // weak chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'incomplete'>, element2?: Chain<V2, V3, 'incomplete'>, element3?: Chain<V3, V4, 'incomplete'>, element4?: Chain<V4, V5, 'incomplete'>, element5?: Chain<V5, V6, 'incomplete'>, element6?: Chain<V6, V7, 'incomplete'>, element7?: Chain<V7, V8, 'incomplete'>, element8?: Chain<V8, V9, 'incomplete'>, element9?: Chain<V9, V10, 'incomplete'>, element10?: Chain<V10, V11, 'incomplete'>, element11?: Chain<V11, V12, 'incomplete'>, element12?: Chain<V12, V13, 'incomplete'>, element13?: Chain<V13, V14, 'incomplete'>, element14?: Chain<V14, V15, 'incomplete'>, element15?: Chain<V15, V16, 'incomplete'>, element16?: Chain<V16, V17, 'incomplete'>, element17?: Chain<V17, V18, 'incomplete'>, element18?: Chain<V18, V19, 'incomplete'>, element19?: Chain<V19, V20, 'incomplete'>)
  : WeakChain<V1[], V20[]>

  // async weak chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'async-incomplete'>, element2?: Chain<V2, V3, 'async-incomplete'>, element3?: Chain<V3, V4, 'async-incomplete'>, element4?: Chain<V4, V5, 'async-incomplete'>, element5?: Chain<V5, V6, 'async-incomplete'>, element6?: Chain<V6, V7, 'async-incomplete'>, element7?: Chain<V7, V8, 'async-incomplete'>, element8?: Chain<V8, V9, 'async-incomplete'>, element9?: Chain<V9, V10, 'async-incomplete'>, element10?: Chain<V10, V11, 'async-incomplete'>, element11?: Chain<V11, V12, 'async-incomplete'>, element12?: Chain<V12, V13, 'async-incomplete'>, element13?: Chain<V13, V14, 'async-incomplete'>, element14?: Chain<V14, V15, 'async-incomplete'>, element15?: Chain<V15, V16, 'async-incomplete'>, element16?: Chain<V16, V17, 'async-incomplete'>, element17?: Chain<V17, V18, 'async-incomplete'>, element18?: Chain<V18, V19, 'async-incomplete'>, element19?: Chain<V19, V20, 'async-incomplete'>)
  : AsyncWeakChain<V1[], V20[]>
}

// @ts-expect-error
export const each: EachCall = (listen1?: AnyChain<any, any>, ...additionalListeners: AnyChain<any, any>[]): AnyChain<any, any> => {
  if (!listen1) {
    return through()
  }
  const listen = chain(listen1, ...additionalListeners)
  return (resolve, parameters, context, status) => {
    if (!parameters) {
      return resolve(parameters)
    }
    for(let i = 0; i < parameters.length; i++) {
      if (!context[i]) {
        context[i] = {}
      }
    }

    const values: any[] = []
    let updateReady = false
    let pendingCleanup: CleanupExec = null

    const cleanup = (final: boolean = false) => {
      execute(pendingCleanup, final)
      pendingCleanup = null
    }

    const updateItem = (value: any, i: number) => {
      values[i] = value

      if (!updateReady) {
        return
      }

      return [
        resolve(values.filter(x => x !== undefined && x !== null)),
        cleanup,
        () => { delete values[i] }
      ]
    }

    const unsubscribe = parameters.map((item: any, i: number) => listen((value: any) => updateItem(value, i), item, context[i], status))
    updateReady = true
    pendingCleanup = resolve(values)

    return [unsubscribe, cleanup]
  }
}

