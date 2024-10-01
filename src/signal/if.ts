import { Function1, Chain, Context, SyncChain, AsyncChain, WeakChain, AsyncWeakChain, CleanupExec } from "./types"

export interface IfFn {
    <V1, V2 = V1, V3 = V1>(condition: Function1<V1, boolean>, listenTrue: SyncChain<V1, V2>, listenFalse?: SyncChain<V1, V3>): SyncChain<V1, V2 | V3>
    <V1, V2 = V1, V3 = V1>(condition: Function1<V1, boolean>, listenTrue: AsyncChain<V1, V2>, listenFalse?: AsyncChain<V1, V3>): AsyncChain<V1, V2 | V3>
    <V1, V2 = V1, V3 = V1>(condition: Function1<V1, boolean>, listenTrue: WeakChain<V1, V2>, listenFalse?: WeakChain<V1, V3>): WeakChain<V1, V2 | V3>
    <V1, V2 = V1, V3 = V1>(condition: Function1<V1, boolean>, listenTrue: AsyncWeakChain<V1, V2>, listenFalse?: AsyncWeakChain<V1, V3>): AsyncWeakChain<V1, V2 | V3>
}

// @ts-expect-error
export const ifFn: IfFn = <V1, V2 = V1, V3 = V1>(condition: Function1<V1, boolean>, listenTrue: Chain<V1, V2>, listenFalse?: Chain<V1, V3>): Chain<V1, V2 | V3> => {
    return (next: Function1<V2 | V3, CleanupExec>, parameter: V1, context: Context, status: any) => {
        if (condition(parameter)) {
            return listenTrue(next, parameter, context, status)
        }

        if (listenFalse) {
            return listenFalse(next, parameter, context, status)
        }

        return next(parameter as any)
    }
}

// @ts-expect-error
export const ifNot: IfFn = <V1, V2 = V1, V3 = V1>(condition: Function1<V1, boolean>, listenTrue: Chain<V1, V2>, listenFalse?: Chain<V1, V3>): Chain<V1, V2 | V3> => {
    return (next: Function1<V2 | V3, CleanupExec>, parameter: V1, context: Context, status: any) => {
        if (!condition(parameter)) {
            return listenTrue(next, parameter, context, status)
        }

        if (listenFalse) {
            return listenFalse(next, parameter, context, status)
        }

        return next(parameter as any)
    }
}