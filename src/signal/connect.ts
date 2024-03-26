import type { Chain, FunctionVoid } from "./types"
import { chain } from "./chain"
import { execute } from "./util"

type ConnectCall = <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: Chain<V1, V2>, element2?: Chain<V2, V3>, element3?: Chain<V3, V4>, element4?: Chain<V4, V5>, element5?: Chain<V5, V6>, element6?: Chain<V6, V7>, element7?: Chain<V7, V8>, element8?: Chain<V8, V9>, element9?: Chain<V9, V10>, element10?: Chain<V10, V11>, element11?: Chain<V11, V12>, element12?: Chain<V12, V13>, element13?: Chain<V13, V14>, element14?: Chain<V14, V15>, element15?: Chain<V15, V16>, element16?: Chain<V16, V17>, element17?: Chain<V17, V18>, element18?: Chain<V18, V19>, element19?: Chain<V19, V20>)
  => FunctionVoid

// @ts-expect-error
export const connect: ConnectCall = (listen1: Chain<any, any>, ...additionalListeners: Chain<any, any>[]): FunctionVoid => {
    const chained = chain(listen1, ...additionalListeners) as Chain<void, any>
    const unsubscribe = chained(() => {}, undefined, {})
    return () => { execute(unsubscribe, true) }
}
