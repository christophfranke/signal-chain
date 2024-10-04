import type { Chain, SyncChain, AsyncChain, WeakChain, AsyncWeakChain, NextFn, CleanupExec } from "./types"
import { execute } from "./util"

export interface CombineCall {
    // sync
    <From, To1 = never, To2 = never, To3 = never, To4 = never, To5 = never, To6 = never, To7 = never, To8 = never, To9 = never, To10 = never, To11 = never, To12 = never, To13 = never, To14 = never, To15 = never, To16 = never, To17 = never, To18 = never, To19 = never, To20 = never>(element1?: SyncChain<From, To1>, element2?: SyncChain<From, To2>, element3?: SyncChain<From, To3>, element4?: SyncChain<From, To4>, element5?: SyncChain<From, To5>, element6?: SyncChain<From, To6>, element7?: SyncChain<From, To7>, element8?: SyncChain<From, To8>, element9?: SyncChain<From, To9>, element10?: SyncChain<From, To10>, element11?: SyncChain<From, To11>, element12?: SyncChain<From, To12>, element13?: SyncChain<From, To13>, element14?: SyncChain<From, To14>, element15?: SyncChain<From, To15>, element16?: SyncChain<From, To16>, element17?: SyncChain<From, To17>, element18?: SyncChain<From, To18>, element19?: SyncChain<From, To19>, element20?: SyncChain<From, To20>): SyncChain<From, [To1, To2, To3, To4, To5, To6, To7, To8, To9, To10, To11, To12, To13, To14, To15, To16, To17, To18, To19, To20]>

    // async
    <From, To1 = never, To2 = never, To3 = never, To4 = never, To5 = never, To6 = never, To7 = never, To8 = never, To9 = never, To10 = never, To11 = never, To12 = never, To13 = never, To14 = never, To15 = never, To16 = never, To17 = never, To18 = never, To19 = never, To20 = never>(element1?: AsyncChain<From, To1>, element2?: AsyncChain<From, To2>, element3?: AsyncChain<From, To3>, element4?: AsyncChain<From, To4>, element5?: AsyncChain<From, To5>, element6?: AsyncChain<From, To6>, element7?: AsyncChain<From, To7>, element8?: AsyncChain<From, To8>, element9?: AsyncChain<From, To9>, element10?: AsyncChain<From, To10>, element11?: AsyncChain<From, To11>, element12?: AsyncChain<From, To12>, element13?: AsyncChain<From, To13>, element14?: AsyncChain<From, To14>, element15?: AsyncChain<From, To15>, element16?: AsyncChain<From, To16>, element17?: AsyncChain<From, To17>, element18?: AsyncChain<From, To18>, element19?: AsyncChain<From, To19>, element20?: AsyncChain<From, To20>): AsyncChain<From, [To1 | undefined, To2 | undefined, To3 | undefined, To4 | undefined, To5 | undefined, To6 | undefined, To7 | undefined, To8 | undefined, To9 | undefined, To10 | undefined, To11 | undefined, To12 | undefined, To13 | undefined, To14 | undefined, To15 | undefined, To16 | undefined, To17 | undefined, To18 | undefined, To19 | undefined, To20 | undefined]>

    // weak
    <From, To1 = never, To2 = never, To3 = never, To4 = never, To5 = never, To6 = never, To7 = never, To8 = never, To9 = never, To10 = never, To11 = never, To12 = never, To13 = never, To14 = never, To15 = never, To16 = never, To17 = never, To18 = never, To19 = never, To20 = never>(element1?: WeakChain<From, To1>, element2?: WeakChain<From, To2>, element3?: WeakChain<From, To3>, element4?: WeakChain<From, To4>, element5?: WeakChain<From, To5>, element6?: WeakChain<From, To6>, element7?: WeakChain<From, To7>, element8?: WeakChain<From, To8>, element9?: WeakChain<From, To9>, element10?: WeakChain<From, To10>, element11?: WeakChain<From, To11>, element12?: WeakChain<From, To12>, element13?: WeakChain<From, To13>, element14?: WeakChain<From, To14>, element15?: WeakChain<From, To15>, element16?: WeakChain<From, To16>, element17?: WeakChain<From, To17>, element18?: WeakChain<From, To18>, element19?: WeakChain<From, To19>, element20?: WeakChain<From, To20>): WeakChain<From, [To1 | undefined, To2 | undefined, To3 | undefined, To4 | undefined, To5 | undefined, To6 | undefined, To7 | undefined, To8 | undefined, To9 | undefined, To10 | undefined, To11 | undefined, To12 | undefined, To13 | undefined, To14 | undefined, To15 | undefined, To16 | undefined, To17 | undefined, To18 | undefined, To19 | undefined, To20 | undefined]>

    // async-weak
    <From, To1 = never, To2 = never, To3 = never, To4 = never, To5 = never, To6 = never, To7 = never, To8 = never, To9 = never, To10 = never, To11 = never, To12 = never, To13 = never, To14 = never, To15 = never, To16 = never, To17 = never, To18 = never, To19 = never, To20 = never>(element1?: AsyncWeakChain<From, To1>, element2?: AsyncWeakChain<From, To2>, element3?: AsyncWeakChain<From, To3>, element4?: AsyncWeakChain<From, To4>, element5?: AsyncWeakChain<From, To5>, element6?: AsyncWeakChain<From, To6>, element7?: AsyncWeakChain<From, To7>, element8?: AsyncWeakChain<From, To8>, element9?: AsyncWeakChain<From, To9>, element10?: AsyncWeakChain<From, To10>, element11?: AsyncWeakChain<From, To11>, element12?: AsyncWeakChain<From, To12>, element13?: AsyncWeakChain<From, To13>, element14?: AsyncWeakChain<From, To14>, element15?: AsyncWeakChain<From, To15>, element16?: AsyncWeakChain<From, To16>, element17?: AsyncWeakChain<From, To17>, element18?: AsyncWeakChain<From, To18>, element19?: AsyncWeakChain<From, To19>, element20?: AsyncWeakChain<From, To20>): AsyncWeakChain<From, [To1 | undefined, To2 | undefined, To3 | undefined, To4 | undefined, To5 | undefined, To6 | undefined, To7 | undefined, To8 | undefined, To9 | undefined, To10 | undefined, To11 | undefined, To12 | undefined, To13 | undefined, To14 | undefined, To15 | undefined, To16 | undefined, To17 | undefined, To18 | undefined, To19 | undefined, To20 | undefined]>
}

// @ts-expect-error
export const combine: CombineCall = <From, To>(...listens: Chain<From, To>[]): Chain<From, To[]> => {
    if (listens.length === 0) {
        return (next: NextFn<To[]>, value: any) => next([value])
    }

    return (next: NextFn<To[]>, parameter: From, context: any, status: any) => {
        for(let i = 0; i < listens.length; i++) {
            if (!context[i]) {
                context[i] = {}
            }
        }

        const values: To[] = []
        let updateReady = false
        let pendingCleanup: CleanupExec = null

        const cleanup = (final: boolean = false) => {
            execute(pendingCleanup, final)
            pendingCleanup = null
        }

        const updateItem = (value: To, i: number) => {
            values[i] = value

            if (!updateReady) {
              return
            }

            execute(pendingCleanup)
            pendingCleanup = next(values)

            return cleanup
        }

        const unsubscribe = listens.map((listener, i) => listener(value => updateItem(value, i), parameter, context[i], status))
        updateReady = true
        pendingCleanup = next(values)

        return [unsubscribe, cleanup]
    }
}




