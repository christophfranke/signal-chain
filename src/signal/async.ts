import type { Chain, CleanupExec, ChainType, AsyncChain, AsyncWeakChain } from './types'
import { chain } from './chain'

import { execute } from './util'


export interface AwaitCall {
    <V1, V2>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>): AsyncChain<V1, V2 | Error>
    <V1, V2>(element1: Chain<V1, Promise<V2>, ChainType>): AsyncWeakChain<V1, V2 | Error>
    <V1, V2, V3>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>): AsyncChain<V1, V3 | Error>
    <V1, V2, V3>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>): AsyncWeakChain<V1, V3 | Error>
    <V1, V2, V3, V4>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>): AsyncChain<V1, V4 | Error>
    <V1, V2, V3, V4>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>): AsyncWeakChain<V1, V4 | Error>
    <V1, V2, V3, V4, V5>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>): AsyncChain<V1, V5 | Error>
    <V1, V2, V3, V4, V5>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>): AsyncWeakChain<V1, V5 | Error>
    <V1, V2, V3, V4, V5, V6>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>, element5: Chain<V5, Promise<V6>, 'sync' | 'async'>): AsyncChain<V1, V6 | Error>
    <V1, V2, V3, V4, V5, V6>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>, element5: Chain<V5, Promise<V6>, ChainType>): AsyncWeakChain<V1, V6 | Error>
    <V1, V2, V3, V4, V5, V6, V7>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>, element5: Chain<V5, Promise<V6>, 'sync' | 'async'>, element6: Chain<V6, Promise<V7>, 'sync' | 'async'>): AsyncChain<V1, V7 | Error>
    <V1, V2, V3, V4, V5, V6, V7>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>, element5: Chain<V5, Promise<V6>, ChainType>, element6: Chain<V6, Promise<V7>, ChainType>): AsyncWeakChain<V1, V7 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>, element5: Chain<V5, Promise<V6>, 'sync' | 'async'>, element6: Chain<V6, Promise<V7>, 'sync' | 'async'>, element7: Chain<V7, Promise<V8>, 'sync' | 'async'>): AsyncChain<V1, V8 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>, element5: Chain<V5, Promise<V6>, ChainType>, element6: Chain<V6, Promise<V7>, ChainType>, element7: Chain<V7, Promise<V8>, ChainType>): AsyncWeakChain<V1, V8 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>, element5: Chain<V5, Promise<V6>, 'sync' | 'async'>, element6: Chain<V6, Promise<V7>, 'sync' | 'async'>, element7: Chain<V7, Promise<V8>, 'sync' | 'async'>, element8: Chain<V8, Promise<V9>, 'sync' | 'async'>): AsyncChain<V1, V9 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8, V9>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>, element5: Chain<V5, Promise<V6>, ChainType>, element6: Chain<V6, Promise<V7>, ChainType>, element7: Chain<V7, Promise<V8>, ChainType>, element8: Chain<V8, Promise<V9>, ChainType>): AsyncWeakChain<V1, V9 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>, element5: Chain<V5, Promise<V6>, 'sync' | 'async'>, element6: Chain<V6, Promise<V7>, 'sync' | 'async'>, element7: Chain<V7, Promise<V8>, 'sync' | 'async'>, element8: Chain<V8, Promise<V9>, 'sync' | 'async'>, element9: Chain<V9, Promise<V10>, 'sync' | 'async'>): AsyncChain<V1, V10 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>, element5: Chain<V5, Promise<V6>, ChainType>, element6: Chain<V6, Promise<V7>, ChainType>, element7: Chain<V7, Promise<V8>, ChainType>, element8: Chain<V8, Promise<V9>, ChainType>, element9: Chain<V9, Promise<V10>, ChainType>): AsyncWeakChain<V1, V10 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: Chain<V1, Promise<V2>, 'sync' | 'async'>, element2: Chain<V2, Promise<V3>, 'sync' | 'async'>, element3: Chain<V3, Promise<V4>, 'sync' | 'async'>, element4: Chain<V4, Promise<V5>, 'sync' | 'async'>, element5: Chain<V5, Promise<V6>, 'sync' | 'async'>, element6: Chain<V6, Promise<V7>, 'sync' | 'async'>, element7: Chain<V7, Promise<V8>, 'sync' | 'async'>, element8: Chain<V8, Promise<V9>, 'sync' | 'async'>, element9: Chain<V9, Promise<V10>, 'sync' | 'async'>, element10: Chain<V10, Promise<V11>, 'sync' | 'async'>): AsyncChain<V1, V11 | Error>
    <V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11>(element1: Chain<V1, Promise<V2>, ChainType>, element2: Chain<V2, Promise<V3>, ChainType>, element3: Chain<V3, Promise<V4>, ChainType>, element4: Chain<V4, Promise<V5>, ChainType>, element5: Chain<V5, Promise<V6>, ChainType>, element6: Chain<V6, Promise<V7>, ChainType>, element7: Chain<V7, Promise<V8>, ChainType>, element8: Chain<V8, Promise<V9>, ChainType>, element9: Chain<V9, Promise<V10>, ChainType>, element10: Chain<V10, Promise<V11>, ChainType>): AsyncWeakChain<V1, V11 | Error>

    (first: Chain<unknown, unknown>, ...elements: Chain<unknown, unknown>[]): Chain<unknown | Error, unknown>
}

/**
 * Awaits promises in parallel: Whenever a promise resolves, the next stage will be called with the resolved value.
 *
 * @param element1
 * @param ...
 * @param elementN element chain to create a promise
 */
// @ts-expect-error
export const awaitParallel: AwaitCall = (listen1: Chain<unknown, unknown>, ...additionalListeners: Chain<unknown, unknown>[]): Chain<unknown, unknown | Error> => {
    const listen = chain(listen1, ...additionalListeners)

    return (next, value, context) => {
        let cleanupInner: CleanupExec

        if (!context.isInitialized) {
            context.isActive = true
            context.cleanupNext = null
            context.inner = {}
            context.isInitialized = true
        }
        const cleanupFunction = (final: boolean = false) => {
            if (final) {
                context.isActive = false
            }

            execute(cleanupInner, final)
            execute(context.cleanupNext, final)
        }

        cleanupInner = listen(promise => {
            (promise as Promise<unknown>).then(value => {
                if (context.isActive) {
                    execute(context.cleanupNext)
                    context.cleanupNext = next(value)
                }
            }).catch(error => {
                if (context.isActive) {
                    execute(context.cleanupNext)
                    context.cleanupNext = next(error)
                }
            })
            }, value, context.inner)

        return cleanupFunction
    }
}

/**
 * Awaits promise, always chooses latest. When a new promise is created while a promise is still unresolved, the previous promise is cancelled.
 *
 * @param element1
 * @param ...
 * @param elementN element chain to create a promise
 */
// @ts-expect-error
export const awaitLatest: AwaitCall = (listen1: Chain<unknown, unknown>, ...additionalListeners: Chain<unknown, unknown>[]): Chain<unknown, unknown> => {
    const listen = chain(listen1, ...additionalListeners)

    return (next, parameter, context) => {
        let cleanupInner: CleanupExec
        let cleanupNext: CleanupExec
        let isActive = true

        const cleanupFunction = (final: boolean = false) => {
            isActive = false
            execute(cleanupInner, final)
            execute(cleanupNext, final)
        }

        cleanupInner = listen(promise => {
            (promise as Promise<unknown>).then(value => {
                if (isActive) {
                    execute(cleanupNext)
                    cleanupNext = next(value)
                }
            }).catch(error => {
                if (isActive) {
                    execute(cleanupNext)
                    cleanupNext = next(error)
                }
            })
            }, parameter, context)

        return cleanupFunction
    }
}

/**
 * Awaits promises and resolves in order of promise creation. When a promises resolves early, it delayed to keep the order.
 *
 * @param element1
 * @param ...
 * @param elementN element chain to create a promise
 */
// @ts-expect-error
export const awaitOrder: AwaitCall = (listen1: Chain<unknown, unknown>, ...additionalListeners: Chain<unknown, unknown>[]): Chain<unknown, unknown> => {
    const listen = chain(listen1, ...additionalListeners)

    return (next, value, context) => {
        let cleanupInner: CleanupExec
        if (!context.isInitialized) {
            context.queue = []
            context.isActive = true
            context.cleanupNext = null
            context.inner = {}
            context.isInitialized = true
        }

        const cleanupFunction = (final: boolean = false) => {
            if (final) {
                context.isActive = false
                execute(context.cleanupNext, final)
            }

            execute(cleanupInner, final)
        }

        cleanupInner = listen(promise => {
            const waitingPromise = Promise.all(context.queue)
                .then(() => promise)
                .then(result => {
                    if (context.isActive) {
                        execute(context.cleanupNext)
                        context.cleanupNext = next(result)
                    }
                })
                .catch(error => {
                    if (context.isActive) {
                        execute(context.cleanupNext)
                        context.cleanupNext = next(error)
                    }
                })
                // // .catch(resolveErrorToNextStage)
                .finally(() => {
                    context.queue = context.queue.filter((p: Promise<unknown>) => p !== waitingPromise)
                })
            context.queue.push(waitingPromise)
            }, value, context.inner)

        return cleanupFunction
    }
}

/**
 * Awaits promises and queues execution: When a promise is running, the creation of the next promise is delayed until the current promise is resolved.
 *
 * @param element1
 * @param ...
 * @param elementN element chain to create a promise
 */
// @ts-expect-error
export const awaitQueue: AwaitCall = (listen1: Chain<unknown, unknown>, ...additionalListeners: Chain<unknown, unknown>[]): Chain<unknown, unknown> => {
    const listen = chain(listen1, ...additionalListeners)

    return (next, parameter, context) => {
        let cleanupInner: CleanupExec
        if (!context.isInitialized) {
            context.queue = []
            context.isActive = true
            context.cleanupNext = null
            context.inner = {}
            context.isInitialized = true
        }

        const cleanupFunction = (final: boolean = false) => {
            if (final) {
                context.isActive = false
                execute(cleanupInner, final)
            }

            execute(context.cleanupNext, final)
        }

        const waitingPromise = Promise.all(context.queue)
            .then(() => new Promise(resolve => {
                execute(cleanupInner, false)
                cleanupInner = listen(promise => resolve(promise), parameter, context.inner)
            }))
            .then(promise => promise).then(value => {
                if (context.isActive) {
                    execute(context.cleanupNext, false)
                    context.cleanupNext = next(value)
                }
            })
            .catch(error => {
                if (context.isActive) {
                    execute(context.cleanupNext, false)
                    context.cleanupNext = next(error)
                }
            })
            .finally(() => {
                context.queue = context.queue.filter((p: Promise<unknown>) => p !== waitingPromise)
            })
        context.queue.push(waitingPromise)

        return cleanupFunction
    }
}

/**
 * Awaits promises, ignores all incoming values while running from reaching the promise creation chain.
 *
 * @param element1
 * @param ...
 * @param elementN element chain to create a promise
 */
// @ts-expect-error
export const awaitBlock: AwaitCall = (listen1: Chain<unknown, unknown>, ...additionalListeners: Chain<unknown, unknown>[]): Chain<unknown, unknown> => {
    const listen = chain(listen1, ...additionalListeners) as Chain<unknown, Promise<unknown>>

    return (next, parameter, context) => {
        if (!context.isInitialized) {
            context.isBlocking = false
            context.cleanupNext = null
            context.inner = {}
            context.isInitialized = true
        }

        if (context.isBlocking) {
            return
        }

        let isActive = true
        let cleanupInner: CleanupExec

        const cleanupFunction = (final: boolean = false) => {
            if (final) {
                isActive = false
                context.isBlocking = false
                console.log('final cleanupNext', final)
                execute(context.cleanupNext, final)
            }

            execute(cleanupInner, final)
        }

        cleanupInner = listen((promise: Promise<unknown>) => {
            context.isBlocking = true
            promise.then(value => {
                if (isActive) {
                    execute(context.cleanupNext)
                    context.cleanupNext = next(value)
                }
            }).catch(error => {
                if (isActive) {
                    execute(context.cleanupNext)
                    context.cleanupNext = next(error)
                }
            }).finally(() => {
                context.isBlocking = false
            })
            }, parameter, context.inner)

        return cleanupFunction
    }
}


