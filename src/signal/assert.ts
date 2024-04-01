import { Chain, SyncChain, AsyncChain, WeakChain, AsyncWeakChain, NextFn, Context } from "./types"
import { chain } from './chain'

export interface AssertCall<Range, Condition extends Range> {
    <V extends Range>(): SyncChain<V, Condition>

    <V1 extends Range, InnerFrom extends Condition & V1, V2>(element1: SyncChain<InnerFrom, V2>): SyncChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>): SyncChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>): SyncChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>): SyncChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>): SyncChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>): SyncChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>): SyncChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>): SyncChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>): SyncChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>): SyncChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>): SyncChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    <V1 extends Range, InnerFrom extends Condition & V1, V2>(element1: AsyncChain<InnerFrom, V2>): AsyncChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>): AsyncChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>): AsyncChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>): AsyncChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>): AsyncChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>): AsyncChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>): AsyncChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>): AsyncChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>, element9: AsyncChain<V9, V10>): AsyncChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>, element9: AsyncChain<V9, V10>, element10: AsyncChain<V10, V11>): AsyncChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>, element9: AsyncChain<V9, V10>, element10: AsyncChain<V10, V11>, element11: AsyncChain<V11, V12>): AsyncChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    <V1 extends Range, InnerFrom extends Condition & V1, V2>(element1: WeakChain<InnerFrom, V2>): WeakChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>): WeakChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>): WeakChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>): WeakChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>): WeakChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>): WeakChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>): WeakChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>): WeakChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>, element9: WeakChain<V9, V10>): WeakChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>, element9: WeakChain<V9, V10>, element10: WeakChain<V10, V11>): WeakChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>, element9: WeakChain<V9, V10>, element10: WeakChain<V10, V11>, element11: WeakChain<V11, V12>): WeakChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    <V1 extends Range, InnerFrom extends Condition & V1, V2>(element1: AsyncWeakChain<InnerFrom, V2>): AsyncWeakChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>): AsyncWeakChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>): AsyncWeakChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>): AsyncWeakChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>): AsyncWeakChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>): AsyncWeakChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>): AsyncWeakChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>): AsyncWeakChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>, element9: AsyncWeakChain<V9, V10>): AsyncWeakChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>, element9: AsyncWeakChain<V9, V10>, element10: AsyncWeakChain<V10, V11>): AsyncWeakChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Condition & V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>, element9: AsyncWeakChain<V9, V10>, element10: AsyncWeakChain<V10, V11>, element11: AsyncWeakChain<V11, V12>): AsyncWeakChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    (first: Chain<unknown, Condition>, ...elements: Chain<unknown, unknown>[]): Chain<unknown, unknown | Exclude<Range, Condition>>
}

type ConditionFunction<Range, Condition extends Range> = (value: Range) => value is Condition
// @ts-expect-error
export const assert = <Range, Condition extends Range>(condition: ConditionFunction<Range, Condition>, message?: string): AssertCall<Range, Condition> => (listen1?: Chain<Condition, any>, ...additionalListeners: Chain<any, any>[]): Chain<any, any | Exclude<Range, Condition>> => {
    if (!listen1) {
        return (next, parameter) => {
            if (!condition(parameter as any)) {
                throw new Error(`Assertion failed: ${message}` ?? 'Assertion failed')
            }

            return next(parameter)
        }
    }
    const listen = chain(listen1 as any, ...additionalListeners)
    return (next, parameter, context, status) => {
        if (condition(parameter as any)) {
            return listen(next, parameter, context, status)
        }

        return next(parameter as any)
    }
}


export interface AssertNotCall<Range, Condition extends Range> {
    <V extends Range>(): SyncChain<V, Exclude<V, Condition>>

    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2>(element1: SyncChain<InnerFrom, V2>): SyncChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>): SyncChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>): SyncChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>): SyncChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>): SyncChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>): SyncChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>): SyncChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>): SyncChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>): SyncChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>): SyncChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: SyncChain<InnerFrom, V2>, element2: SyncChain<V2, V3>, element3: SyncChain<V3, V4>, element4: SyncChain<V4, V5>, element5: SyncChain<V5, V6>, element6: SyncChain<V6, V7>, element7: SyncChain<V7, V8>, element8: SyncChain<V8, V9>, element9: SyncChain<V9, V10>, element10: SyncChain<V10, V11>, element11: SyncChain<V11, V12>): SyncChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2>(element1: AsyncChain<InnerFrom, V2>): AsyncChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>): AsyncChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>): AsyncChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>): AsyncChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>): AsyncChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>): AsyncChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>): AsyncChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>): AsyncChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>, element9: AsyncChain<V9, V10>): AsyncChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>, element9: AsyncChain<V9, V10>, element10: AsyncChain<V10, V11>): AsyncChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: AsyncChain<InnerFrom, V2>, element2: AsyncChain<V2, V3>, element3: AsyncChain<V3, V4>, element4: AsyncChain<V4, V5>, element5: AsyncChain<V5, V6>, element6: AsyncChain<V6, V7>, element7: AsyncChain<V7, V8>, element8: AsyncChain<V8, V9>, element9: AsyncChain<V9, V10>, element10: AsyncChain<V10, V11>, element11: AsyncChain<V11, V12>): AsyncChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2>(element1: WeakChain<InnerFrom, V2>): WeakChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>): WeakChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>): WeakChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>): WeakChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>): WeakChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>): WeakChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>): WeakChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>): WeakChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>, element9: WeakChain<V9, V10>): WeakChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>, element9: WeakChain<V9, V10>, element10: WeakChain<V10, V11>): WeakChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: WeakChain<InnerFrom, V2>, element2: WeakChain<V2, V3>, element3: WeakChain<V3, V4>, element4: WeakChain<V4, V5>, element5: WeakChain<V5, V6>, element6: WeakChain<V6, V7>, element7: WeakChain<V7, V8>, element8: WeakChain<V8, V9>, element9: WeakChain<V9, V10>, element10: WeakChain<V10, V11>, element11: WeakChain<V11, V12>): WeakChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2>(element1: AsyncWeakChain<InnerFrom, V2>): AsyncWeakChain<V1 | InnerFrom, V2 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>): AsyncWeakChain<V1 | InnerFrom, V3 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>): AsyncWeakChain<V1 | InnerFrom, V4 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>): AsyncWeakChain<V1 | InnerFrom, V5 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>): AsyncWeakChain<V1 | InnerFrom, V6 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>): AsyncWeakChain<V1 | InnerFrom, V7 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>): AsyncWeakChain<V1 | InnerFrom, V8 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>): AsyncWeakChain<V1 | InnerFrom, V9 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>, element9: AsyncWeakChain<V9, V10>): AsyncWeakChain<V1 | InnerFrom, V10 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>, element9: AsyncWeakChain<V9, V10>, element10: AsyncWeakChain<V10, V11>): AsyncWeakChain<V1 | InnerFrom, V11 | Exclude<V1, InnerFrom>>
    <V1 extends Range, InnerFrom extends Exclude<V1, Condition>, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12>(element1: AsyncWeakChain<InnerFrom, V2>, element2: AsyncWeakChain<V2, V3>, element3: AsyncWeakChain<V3, V4>, element4: AsyncWeakChain<V4, V5>, element5: AsyncWeakChain<V5, V6>, element6: AsyncWeakChain<V6, V7>, element7: AsyncWeakChain<V7, V8>, element8: AsyncWeakChain<V8, V9>, element9: AsyncWeakChain<V9, V10>, element10: AsyncWeakChain<V10, V11>, element11: AsyncWeakChain<V11, V12>): AsyncWeakChain<V1 | InnerFrom, V12 | Exclude<V1, InnerFrom>>

    (first: Chain<Condition, unknown>, ...elements: Chain<unknown, unknown>[]): Chain<unknown, unknown | Exclude<Range, Condition>>
}

// @ts-expect-error
export const assertNot = <Range, Condition extends Range>(condition: ConditionFunction<Range, Condition>, message?: string): AssertNotCall<Range, Condition> => (listen1?: Chain<Condition, unknown>, ...additionalListeners: Chain<unknown, unknown>[]) => {
    if (!listen1) {
        return (next: NextFn<unknown>, parameter: unknown) => {
            if (condition(parameter as any)) {
                throw new Error(`Assertion failed: ${message}` ?? 'Assertion failed')
            }

            return next(parameter)
        }
    }
    const listen = chain(listen1 as any, ...additionalListeners)
    return (next: NextFn<unknown>, parameter: unknown, context: Context, status: any) => {
        if (!condition(parameter as any)) {
            return listen(next, parameter, context, status)
        }

        return next(parameter as any)
    }
}

export const isNothing = assert((value): value is undefined | null => value === undefined || value === null, 'Value is not nothing')
export const isNumber = assert((value): value is number => typeof value === 'number', 'Value is not a number')
export const isArray = assert((value): value is any[] => Array.isArray(value), 'Value is not an array')
export const isBoolean = assert((value): value is boolean => typeof value === 'boolean', 'Value is not a boolean')
export const isString = assert((value): value is string => typeof value === 'string', 'Value is not a string')
export const isFunction = assert((value): value is Function => typeof value === 'function', 'Value is not a function')
export const isObject = assert((value): value is object => typeof value === 'object', 'Value is not an object')
export const isError = assert((value): value is Error => value instanceof Error, 'Value is not an error')

export const isNotNothing = assertNot((value): value is undefined | null => value === undefined || value === null, 'Value is nothing')
export const isNotNumber = assertNot((value): value is number => typeof value === 'number', 'Value is a number')
export const isNotArray = assertNot((value): value is any[] => Array.isArray(value), 'Value is an array')
export const isNotBoolean = assertNot((value): value is boolean => typeof value === 'boolean', 'Value is a boolean')
export const isNotString = assertNot((value): value is string => typeof value === 'string', 'Value is a string')
export const isNotFunction = assertNot((value): value is Function => typeof value === 'function', 'Value is a function')
export const isNotObject = assertNot((value): value is object => typeof value === 'object', 'Value is an object')
export const isNotError = assertNot((value): value is Error => value instanceof Error, 'Value is an error')


