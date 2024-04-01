import type { AnyChain, FunctionVoid } from "./types"
import { chain } from "./chain"
import { execute } from "./util"

type ConnectCall = <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: AnyChain<V1, V2>, element2?: AnyChain<V2, V3>, element3?: AnyChain<V3, V4>, element4?: AnyChain<V4, V5>, element5?: AnyChain<V5, V6>, element6?: AnyChain<V6, V7>, element7?: AnyChain<V7, V8>, element8?: AnyChain<V8, V9>, element9?: AnyChain<V9, V10>, element10?: AnyChain<V10, V11>, element11?: AnyChain<V11, V12>, element12?: AnyChain<V12, V13>, element13?: AnyChain<V13, V14>, element14?: AnyChain<V14, V15>, element15?: AnyChain<V15, V16>, element16?: AnyChain<V16, V17>, element17?: AnyChain<V17, V18>, element18?: AnyChain<V18, V19>, element19?: AnyChain<V19, V20>)
  => FunctionVoid

// @ts-expect-error
export const connect: ConnectCall = (listen1: AnyChain<any, any>, ...additionalListeners: AnyChain<any, any>[]): FunctionVoid => {
    const chained = chain(listen1, ...additionalListeners) as AnyChain<void, any>
    const status = { is: 'sync' } as any
    const unsubscribe = chained(() => {}, undefined, {}, status)
    return () => { execute(unsubscribe, true) }
}
