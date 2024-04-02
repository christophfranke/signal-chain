import type { Chain, WeakChain, SyncChain, AsyncChain, AsyncWeakChain, ConnectedChain, NextFn } from './types'

// sync + sync = sync
// sync + async = async
// sync + incomplete = incomplete
// async + incomplete = async-incomplete


export interface ChainCall {
  // sync chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'sync'>, element2?: Chain<V2, V3, 'sync'>, element3?: Chain<V3, V4, 'sync'>, element4?: Chain<V4, V5, 'sync'>, element5?: Chain<V5, V6, 'sync'>, element6?: Chain<V6, V7, 'sync'>, element7?: Chain<V7, V8, 'sync'>, element8?: Chain<V8, V9, 'sync'>, element9?: Chain<V9, V10, 'sync'>, element10?: Chain<V10, V11, 'sync'>, element11?: Chain<V11, V12, 'sync'>, element12?: Chain<V12, V13, 'sync'>, element13?: Chain<V13, V14, 'sync'>, element14?: Chain<V14, V15, 'sync'>, element15?: Chain<V15, V16, 'sync'>, element16?: Chain<V16, V17, 'sync'>, element17?: Chain<V17, V18, 'sync'>, element18?: Chain<V18, V19, 'sync'>, element19?: Chain<V19, V20, 'sync'>)
  : SyncChain<V1, V20>

  // async chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'async'>, element2?: Chain<V2, V3, 'async'>, element3?: Chain<V3, V4, 'async'>, element4?: Chain<V4, V5, 'async'>, element5?: Chain<V5, V6, 'async'>, element6?: Chain<V6, V7, 'async'>, element7?: Chain<V7, V8, 'async'>, element8?: Chain<V8, V9, 'async'>, element9?: Chain<V9, V10, 'async'>, element10?: Chain<V10, V11, 'async'>, element11?: Chain<V11, V12, 'async'>, element12?: Chain<V12, V13, 'async'>, element13?: Chain<V13, V14, 'async'>, element14?: Chain<V14, V15, 'async'>, element15?: Chain<V15, V16, 'async'>, element16?: Chain<V16, V17, 'async'>, element17?: Chain<V17, V18, 'async'>, element18?: Chain<V18, V19, 'async'>, element19?: Chain<V19, V20, 'async'>)
  : AsyncChain<V1, V20>

  // weak chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'incomplete'>, element2?: Chain<V2, V3, 'incomplete'>, element3?: Chain<V3, V4, 'incomplete'>, element4?: Chain<V4, V5, 'incomplete'>, element5?: Chain<V5, V6, 'incomplete'>, element6?: Chain<V6, V7, 'incomplete'>, element7?: Chain<V7, V8, 'incomplete'>, element8?: Chain<V8, V9, 'incomplete'>, element9?: Chain<V9, V10, 'incomplete'>, element10?: Chain<V10, V11, 'incomplete'>, element11?: Chain<V11, V12, 'incomplete'>, element12?: Chain<V12, V13, 'incomplete'>, element13?: Chain<V13, V14, 'incomplete'>, element14?: Chain<V14, V15, 'incomplete'>, element15?: Chain<V15, V16, 'incomplete'>, element16?: Chain<V16, V17, 'incomplete'>, element17?: Chain<V17, V18, 'incomplete'>, element18?: Chain<V18, V19, 'incomplete'>, element19?: Chain<V19, V20, 'incomplete'>)
  : WeakChain<V1, V20>

  // async weak chain
  <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, 'async-incomplete'>, element2?: Chain<V2, V3, 'async-incomplete'>, element3?: Chain<V3, V4, 'async-incomplete'>, element4?: Chain<V4, V5, 'async-incomplete'>, element5?: Chain<V5, V6, 'async-incomplete'>, element6?: Chain<V6, V7, 'async-incomplete'>, element7?: Chain<V7, V8, 'async-incomplete'>, element8?: Chain<V8, V9, 'async-incomplete'>, element9?: Chain<V9, V10, 'async-incomplete'>, element10?: Chain<V10, V11, 'async-incomplete'>, element11?: Chain<V11, V12, 'async-incomplete'>, element12?: Chain<V12, V13, 'async-incomplete'>, element13?: Chain<V13, V14, 'async-incomplete'>, element14?: Chain<V14, V15, 'async-incomplete'>, element15?: Chain<V15, V16, 'async-incomplete'>, element16?: Chain<V16, V17, 'async-incomplete'>, element17?: Chain<V17, V18, 'async-incomplete'>, element18?: Chain<V18, V19, 'async-incomplete'>, element19?: Chain<V19, V20, 'async-incomplete'>)
  : AsyncWeakChain<V1, V20>
}

// @ts-expect-error
export const chain: ChainCall = (
  first: Chain<unknown, unknown>,
  ...elements: (Chain<unknown, unknown> | undefined)[]
): Chain<unknown, unknown> => {
  return (next, param, context, status) => {
    for(let i = 0; i < elements.length + 1; i++) {
      if (!context[`${i}`]) {
        context[`${i}`] = {}
      }
    }

    const chainedFunction = elements.reduce(
      (chained: ConnectedChain<unknown, unknown>, element: Chain<unknown, unknown> | undefined, index) => {
      return (nextInner, paramInner) => {
        return chained(
          (intermediate) => element!(nextInner, intermediate, context[`${index + 1}`], status),
          paramInner,
        )
      }
    }, (nextInner, paramInner) => first(nextInner, paramInner, context[0], status))

    // Execute the chained function with the initial next, param, and context
    return chainedFunction(next, param)
  }
}



export interface SideChainCall {
    // sync
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1?: SyncChain<V1, V2>, element2?: SyncChain<V2, V3>, element3?: SyncChain<V3, V4>, element4?: SyncChain<V4, V5>, element5?: SyncChain<V5, V6>, element6?: SyncChain<V6, V7>, element7?: SyncChain<V7, V8>, element8?: SyncChain<V8, V9>, element9?: SyncChain<V9, V10>, element10?: SyncChain<V10, V11>, element11?: SyncChain<V11, V12>, element12?: SyncChain<V12, V13>, element13?: SyncChain<V13, V14>, element14?: SyncChain<V14, V15>, element15?: SyncChain<V15, V16>, element16?: SyncChain<V16, V17>, element17?: SyncChain<V17, V18>, element18?: SyncChain<V18, V19>, element19?: SyncChain<V19, V20>)
        : SyncChain<V1, [V1, V20]>

    // async
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1?: AsyncChain<V1, V2>, element2?: AsyncChain<V2, V3>, element3?: AsyncChain<V3, V4>, element4?: AsyncChain<V4, V5>, element5?: AsyncChain<V5, V6>, element6?: AsyncChain<V6, V7>, element7?: AsyncChain<V7, V8>, element8?: AsyncChain<V8, V9>, element9?: AsyncChain<V9, V10>, element10?: AsyncChain<V10, V11>, element11?: AsyncChain<V11, V12>, element12?: AsyncChain<V12, V13>, element13?: AsyncChain<V13, V14>, element14?: AsyncChain<V14, V15>, element15?: AsyncChain<V15, V16>, element16?: AsyncChain<V16, V17>, element17?: AsyncChain<V17, V18>, element18?: AsyncChain<V18, V19>, element19?: AsyncChain<V19, V20>)
        : AsyncChain<V1, [V1, V20]>

    // weak
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1?: WeakChain<V1, V2>, element2?: WeakChain<V2, V3>, element3?: WeakChain<V3, V4>, element4?: WeakChain<V4, V5>, element5?: WeakChain<V5, V6>, element6?: WeakChain<V6, V7>, element7?: WeakChain<V7, V8>, element8?: WeakChain<V8, V9>, element9?: WeakChain<V9, V10>, element10?: WeakChain<V10, V11>, element11?: WeakChain<V11, V12>, element12?: WeakChain<V12, V13>, element13?: WeakChain<V13, V14>, element14?: WeakChain<V14, V15>, element15?: WeakChain<V15, V16>, element16?: WeakChain<V16, V17>, element17?: WeakChain<V17, V18>, element18?: WeakChain<V18, V19>, element19?: WeakChain<V19, V20>)
        : WeakChain<V1, [V1, V20]>

    // async-weak
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1?: AsyncWeakChain<V1, V2>, element2?: AsyncWeakChain<V2, V3>, element3?: AsyncWeakChain<V3, V4>, element4?: AsyncWeakChain<V4, V5>, element5?: AsyncWeakChain<V5, V6>, element6?: AsyncWeakChain<V6, V7>, element7?: AsyncWeakChain<V7, V8>, element8?: AsyncWeakChain<V8, V9>, element9?: AsyncWeakChain<V9, V10>, element10?: AsyncWeakChain<V10, V11>, element11?: AsyncWeakChain<V11, V12>, element12?: AsyncWeakChain<V12, V13>, element13?: AsyncWeakChain<V13, V14>, element14?: AsyncWeakChain<V14, V15>, element15?: AsyncWeakChain<V15, V16>, element16?: AsyncWeakChain<V16, V17>, element17?: AsyncWeakChain<V17, V18>, element18?: AsyncWeakChain<V18, V19>, element19?: AsyncWeakChain<V19, V20>)
        : AsyncWeakChain<V1, [V1, V20]>
}

// @ts-expect-error
export const sidechain: SideChainCall = (first: Chain<unknown, unknown>, ...elements: Chain<unknown, unknown>[]): Chain<unknown, [unknown, unknown]> => {
  const innerChain = chain(first, ...elements)

  return (next: NextFn<[unknown, unknown]>, parameter: unknown, context: any, status) => innerChain((intermediate) => next([parameter, intermediate]), parameter, context, status)
}









