import type { AsyncChain, AsyncWeakChain, Chain, Context, Function1, NextFn, SyncChain, WeakChain } from "./types";



export interface CacheFn {
    <CacheV1, CacheV2, V1 extends CacheV1, V2 extends CacheV2>(cache: CacheObject<CacheV1, CacheV2>, listen: SyncChain<V1, V2>): SyncChain<V1, V2>
    <CacheV1, CacheV2, V1 extends CacheV1, V2 extends CacheV2>(cache: CacheObject<CacheV1, CacheV2>, listen: AsyncChain<V1, V2>): AsyncChain<V1, V2>
    <CacheV1, CacheV2, V1 extends CacheV1, V2 extends CacheV2>(cache: CacheObject<CacheV1, CacheV2>, listen: WeakChain<V1, V2>): WeakChain<V1, V2>
    <CacheV1, CacheV2, V1 extends CacheV1, V2 extends CacheV2>(cache: CacheObject<CacheV1, CacheV2>, listen: AsyncWeakChain<V1, V2>): AsyncWeakChain<V1, V2>
}

export interface UseFn<CacheFrom, CacheTo> {
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: SyncChain<V1, V2>): SyncChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: AsyncChain<V1, V2>): AsyncChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: WeakChain<V1, V2>): WeakChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: AsyncWeakChain<V1, V2>): AsyncWeakChain<V1, V2>
}

export type CacheConfig<From, To> = {
    key: Function1<From, string>
    isValid: Function1<To, boolean>
    sanitize: Function1<To, To>
    secondsToLive?: number
}

export type CacheObject<From = string, To = unknown> = {
    config: CacheConfig<From, To>
    data: Record<string, To>
    use: UseFn<From, To>
}

export const createCache = <From, To>(config?: Partial<CacheConfig<From, To>>, data?: Record<string, To>): CacheObject<From, To> => {
    const resultConfig = config ?? {}

    // TODO: static constraint that From = string when no key function given
    if ('key' !in resultConfig) {
        resultConfig.key = (k: From) => k as string
    }

    if ('isValid' !in resultConfig) {
        resultConfig.isValid = () => true
    }

    if ('sanitize' !in resultConfig) {
        resultConfig.sanitize = (k: To) => k
    }

    const cache = {
        config: resultConfig as CacheConfig<From, To>,
        data: data ?? {},
    }

    // @ts-ignore
    const useCache: UseFn<From, To> = (listen: Chain<From, To>): Chain<From, To> => {
        return (next: NextFn<To>, parameter: From, context: Context, status: any) => {
            const key = cache.config.key(parameter)
            if (key in cache.data) {
                return next(cache.data[key] as To)
            }

            return listen((value: To) => {
                cache.data[key] = value
                return next(value)
            }, parameter, context, status)
        }
    }

    return {
        ...cache,
        use: useCache
    }
}

// @ts-ignore
export const useCache: CacheFn = <CacheFrom, From extends CacheFrom, To>(cache: CacheObject<From>, listen: Chain<From, To>): Chain<From, To> => {
    return (next: NextFn<To>, parameter: From, context: Context, status: any) => {
        const key = cache.config.key(parameter)
        if (key in cache.data) {
            return next(cache.data[key] as To)
        }

        return listen((value: To) => {
            cache.data[key] = value
            return next(value)
        }, parameter, context, status)
    }
}