import type { Chain, ChainType, IncompleteChain, SyncChain, AsyncChain, ConnectedChain, NextFn } from './types'

// sync + sync = sync
// sync + async = async
// sync + incomplete = incomplete
// async + incomplete = async-incomplete
// incomplete + async = incomplete-async
// async-incomplete + incomplete = async-incomplete
// incomplete-async + async = incomplete-async
// async-incomplete + async = async-incomplete
// incomplete-async + incomplete = incomplete-async-incomplete
// async + incomplete-async-incomplete = async-incomplete
// incomplete-async-incomplete + async = incomplete-async-incomplete
// incomplete-async-incomplete + incomplete = incomplete-async-incomplete
// incomplete + incomplete-async-incomplete = incomplete-async-incomplete

type CombineChainType<A, B> = A extends 'incomplete' ? A : B extends 'incomplete' ? B : A extends 'async' ? A : B extends 'async' ? B : 'sync'
type ComputeChainType<A> = A extends [infer Head, ...infer Tail] ? CombineChainType<Head, ComputeChainType<Tail>> : 'sync'
type InferChainName<C> = C extends Chain<infer From, infer To, infer Name> ? Name extends 'incomplete' ? IncompleteChain<From, To> : Name extends 'sync' ? AsyncChain<From, To> : Name extends 'sync' ? SyncChain<From, To> : never : never
type Test = ComputeChainType<['async', 'incomplete', 'sync']>
// type Test1 = Chain<number, number, true> extends SyncChain<number, number> ? true : false
// type Test2 = Chain<number, number, true> extends AsyncChain<number, number> ? true : false
// type Test3 = Chain<number, number, false> extends SyncChain<number, number> ? true : false
// type Test4 = Chain<number, number, false> extends AsyncChain<number, number> ? true : false
// type Test5 = Chain<number, number, boolean> extends SyncChain<number, number> ? true : false
// type Test6 = Chain<number, number, boolean> extends AsyncChain<number, number> ? true : false


type ChainCall = <V1, Sync1 extends ChainType, V2 = V1, Sync2 extends ChainType = Sync1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2, Sync1>, element2?: Chain<V2, V3, Sync2>, element3?: Chain<V3, V4>, element4?: Chain<V4, V5>, element5?: Chain<V5, V6>, element6?: Chain<V6, V7>, element7?: Chain<V7, V8>, element8?: Chain<V8, V9>, element9?: Chain<V9, V10>, element10?: Chain<V10, V11>, element11?: Chain<V11, V12>, element12?: Chain<V12, V13>, element13?: Chain<V13, V14>, element14?: Chain<V14, V15>, element15?: Chain<V15, V16>, element16?: Chain<V16, V17>, element17?: Chain<V17, V18>, element18?: Chain<V18, V19>, element19?: Chain<V19, V20>)
  => InferChainName<Chain<V1, V20, ComputeChainType<[Sync1, Sync2]>>>


// @ts-expect-error the function is more general than its type, but 20 arguments should be fine
export const chain: ChainCall = (
  first: Chain<unknown, unknown>,
  ...elements: (Chain<unknown, unknown> | undefined)[]
): Chain<unknown, unknown> => {
  return (next, param, context) => {
    for(let i = 0; i < elements.length + 1; i++) {
      if (!context[`${i}`]) {
        context[`${i}`] = {}
      }
    }

    const chainedFunction = elements.reduce(
      (chained: ConnectedChain<unknown, unknown>, element: Chain<unknown, unknown> | undefined, index) => {
      return (nextInner, paramInner) => {
        return chained(
          (intermediate) => element!(nextInner, intermediate, context[`${index + 1}`]),
          paramInner,
        )
      }
    }, (nextInner, paramInner) => first(nextInner, paramInner, context[0]))

    // Execute the chained function with the initial next, param, and context
    return chainedFunction(next, param)
  }
}



export interface SideChainCall {
  <V1, V2>(element1: Chain<V1, V2>): Chain<V1, [V1, V2]>
  <V1, V2, V3>(element1: Chain<V1, V2>, element2: Chain<V2, V3>): Chain<V1, [V1, V3]>
  <V1, V2, V3, V4>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>): Chain<V1, [V1, V4]>
  <V1, V2, V3, V4, V5>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>): Chain<V1, [V1, V5]>
  <V1, V2, V3, V4, V5, V6>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>): Chain<V1, [V1, V6]>
  <V1, V2, V3, V4, V5, V6, V7>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>): Chain<V1, [V1, V7]>
  <V1, V2, V3, V4, V5, V6, V7, V8>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>): Chain<V1, [V1, V8]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>): Chain<V1, [V1, V9]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>): Chain<V1, [V1, V10]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>): Chain<V1, [V1, V11]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>): Chain<V1, [V1, V12]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>): Chain<V1, [V1, V13]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>): Chain<V1, [V1, V14]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>): Chain<V1, [V1, V15]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>): Chain<V1, [V1, V16]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>): Chain<V1, [V1, V17]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>, element17: Chain<V17, V18>): Chain<V1, [V1, V18]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>, element17: Chain<V17, V18>, element18: Chain<V18, V19>): Chain<V1, [V1, V19]>
  <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, V13, V14, V15, V16, V17, V18, V19, V20>(element1: Chain<V1, V2>, element2: Chain<V2, V3>, element3: Chain<V3, V4>, element4: Chain<V4, V5>, element5: Chain<V5, V6>, element6: Chain<V6, V7>, element7: Chain<V7, V8>, element8: Chain<V8, V9>, element9: Chain<V9, V10>, element10: Chain<V10, V11>, element11: Chain<V11, V12>, element12: Chain<V12, V13>, element13: Chain<V13, V14>, element14: Chain<V14, V15>, element15: Chain<V15, V16>, element16: Chain<V16, V17>, element17: Chain<V17, V18>, element18: Chain<V18, V19>, element19: Chain<V19, V20>): Chain<V1, [V1, V20]>

  (first: Chain<unknown, unknown>, ...elements: Chain<unknown, unknown>[]): Chain<unknown, [unknown, unknown]>
}


export const sidechain: SideChainCall = (first: Chain<unknown, unknown>, ...elements: Chain<unknown, unknown>[]): Chain<unknown, [unknown, unknown]> => {
  const innerChain = chain(first, ...elements)

  return (next: NextFn<[unknown, unknown]>, parameter: unknown, context: any) => innerChain((intermediate) => next([parameter, intermediate]), parameter, context)
}









