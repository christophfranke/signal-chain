import { SyncChain, AsyncChain, WeakChain, AsyncWeakChain, Chain } from './types'
import { chain } from './chain'
import { through } from './tools'



export interface CatchCall {
    // sync
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: SyncChain<V1, V2>, element2?: SyncChain<V2, V3>, element3?: SyncChain<V3, V4>, element4?: SyncChain<V4, V5>, element5?: SyncChain<V5, V6>, element6?: SyncChain<V6, V7>, element7?: SyncChain<V7, V8>, element8?: SyncChain<V8, V9>, element9?: SyncChain<V9, V10>, element10?: SyncChain<V10, V11>, element11?: SyncChain<V11, V12>, element12?: SyncChain<V12, V13>, element13?: SyncChain<V13, V14>, element14?: SyncChain<V14, V15>, element15?: SyncChain<V15, V16>, element16?: SyncChain<V16, V17>, element17?: SyncChain<V17, V18>, element18?: SyncChain<V18, V19>, element19?: SyncChain<V19, V20>)
        : SyncChain<V1, V20 | Error>

    // async
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: AsyncChain<V1, V2>, element2?: AsyncChain<V2, V3>, element3?: AsyncChain<V3, V4>, element4?: AsyncChain<V4, V5>, element5?: AsyncChain<V5, V6>, element6?: AsyncChain<V6, V7>, element7?: AsyncChain<V7, V8>, element8?: AsyncChain<V8, V9>, element9?: AsyncChain<V9, V10>, element10?: AsyncChain<V10, V11>, element11?: AsyncChain<V11, V12>, element12?: AsyncChain<V12, V13>, element13?: AsyncChain<V13, V14>, element14?: AsyncChain<V14, V15>, element15?: AsyncChain<V15, V16>, element16?: AsyncChain<V16, V17>, element17?: AsyncChain<V17, V18>, element18?: AsyncChain<V18, V19>, element19?: AsyncChain<V19, V20>)
        : AsyncChain<V1, V20 | Error>

    // weak
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: WeakChain<V1, V2>, element2?: WeakChain<V2, V3>, element3?: WeakChain<V3, V4>, element4?: WeakChain<V4, V5>, element5?: WeakChain<V5, V6>, element6?: WeakChain<V6, V7>, element7?: WeakChain<V7, V8>, element8?: WeakChain<V8, V9>, element9?: WeakChain<V9, V10>, element10?: WeakChain<V10, V11>, element11?: WeakChain<V11, V12>, element12?: WeakChain<V12, V13>, element13?: WeakChain<V13, V14>, element14?: WeakChain<V14, V15>, element15?: WeakChain<V15, V16>, element16?: WeakChain<V16, V17>, element17?: WeakChain<V17, V18>, element18?: WeakChain<V18, V19>, element19?: WeakChain<V19, V20>)
        : WeakChain<V1, V20 | Error>

    // async-weak
    <V1, V2 = V1, V3 = V2, V4 = V3, V5 = V4, V6 = V5, V7 = V6, V8 = V7, V9 = V8, V10 = V9, V11 = V10, V12 = V11, V13 = V12, V14 = V13, V15 = V14, V16 = V15, V17 = V16, V18 = V17, V19 = V18, V20 = V19>(element1: AsyncWeakChain<V1, V2>, element2?: AsyncWeakChain<V2, V3>, element3?: AsyncWeakChain<V3, V4>, element4?: AsyncWeakChain<V4, V5>, element5?: AsyncWeakChain<V5, V6>, element6?: AsyncWeakChain<V6, V7>, element7?: AsyncWeakChain<V7, V8>, element8?: AsyncWeakChain<V8, V9>, element9?: AsyncWeakChain<V9, V10>, element10?: AsyncWeakChain<V10, V11>, element11?: AsyncWeakChain<V11, V12>, element12?: AsyncWeakChain<V12, V13>, element13?: AsyncWeakChain<V13, V14>, element14?: AsyncWeakChain<V14, V15>, element15?: AsyncWeakChain<V15, V16>, element16?: AsyncWeakChain<V16, V17>, element17?: AsyncWeakChain<V17, V18>, element18?: AsyncWeakChain<V18, V19>, element19?: AsyncWeakChain<V19, V20>)
        : AsyncWeakChain<V1, V20 | Error>
}

// @ts-expect-error
export const catchFn: CatchCall = (listen1?: Chain<any, any>, ...additionalListeners: Chain<any, any>[]): Chain<any, any> => {
    if (!listen1) {
        return through()
    }

    const listen = chain(listen1, ...additionalListeners)
    return (resolve, parameter, context, status) => {
        try {
            return listen(resolve, parameter, context, status)
        } catch (error) {
            return resolve(error)
        }
    }
}
