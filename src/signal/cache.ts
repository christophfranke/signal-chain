import type { AsyncChain, AsyncWeakChain, Chain, Context, Function1, NextFn, SyncChain, WeakChain } from "./types";


export interface UseFn<CacheFrom, CacheTo> {
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: SyncChain<V1, V2>): SyncChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: AsyncChain<V1, V2>): AsyncChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: WeakChain<V1, V2>): WeakChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: AsyncWeakChain<V1, V2>): AsyncWeakChain<V1, V2>
}

export interface HitFn<CacheFrom, CacheTo> {
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: SyncChain<V2, V3>): SyncChain<V1, V1 | V3>
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: AsyncChain<V2, V3>): AsyncChain<V1, V1 | V3>
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: WeakChain<V2, V3>): WeakChain<V1, V1 | V3>
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: AsyncWeakChain<V2, V3>): AsyncWeakChain<V1, V1 | V3>
}

export interface WeakUseFn<CacheFrom, CacheTo> {
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: SyncChain<V1, V2>): WeakChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: AsyncChain<V1, V2>): AsyncWeakChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: WeakChain<V1, V2>): WeakChain<V1, V2>
    <V1 extends CacheFrom, V2 extends CacheTo>(listen: AsyncWeakChain<V1, V2>): AsyncWeakChain<V1, V2>
}

export interface WeakHitFn<CacheFrom, CacheTo> {
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: SyncChain<V2, V3>): WeakChain<V1, V1 | V3>
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: AsyncChain<V2, V3>): AsyncWeakChain<V1, V1 | V3>
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: WeakChain<V2, V3>): WeakChain<V1, V1 | V3>
    <V1 extends CacheFrom, V2 extends CacheTo, V3 = V1>(listen: AsyncWeakChain<V2, V3>): AsyncWeakChain<V1, V1 | V3>
}

export type CacheConfig<From, To> = {
    key: Function1<From, string>
    isValid: Function1<To, boolean>
    sanitize: Function1<To, To>
    secondsToLive?: number
}

export type SyncCacheObject<From = string, To = unknown> = {
    config: CacheConfig<From, To>
    data: Record<string, To>
    $: {
        use: UseFn<From, To>
        hit: HitFn<From, To>
    }
}

export type WeakCacheObject<From = string, To = unknown> = {
    config: CacheConfig<From, To>
    data: Record<string, To>
    $: {
        use: WeakUseFn<From, To>
        hit: WeakHitFn<From, To>
    }
}

export interface CreateCacheFn {
    <From = unknown, To = unknown>(config: Omit<Partial<CacheConfig<From, To>>, 'isValid'> & { key: Function1<From, string> }, data?: Record<string, To>): SyncCacheObject<From, To>
    <To>(config?: Omit<Partial<CacheConfig<string, To>>, 'isValid'>, data?: Record<string, To>): SyncCacheObject<string, To>
    <From = unknown, To = unknown>(config: Partial<CacheConfig<From, To>> & { key: Function1<From, string> }, data?: Record<string, To>): WeakCacheObject<From, To>
    <To>(config?: Partial<CacheConfig<string, To>>, data?: Record<string, To>): WeakCacheObject<string, To>
}

// @ts-ignore
export const createCache: CreateCacheFn = <From, To>(config?: Partial<CacheConfig<From, To>>, data?: Record<string, To>): WeakCacheObject<From, To> => {
    const resultConfig = config ?? {}

    if (!('key' in resultConfig)) {
        resultConfig.key = (k: From) => k as string
    }

    if (!('isValid' !in resultConfig)) {
        resultConfig.isValid = () => true
    }

    if (!('sanitize' !in resultConfig)) {
        resultConfig.sanitize = (k: To) => k
    }

    const cache = {
        config: resultConfig as CacheConfig<From, To>,
        data: data ?? {},
    }


    // @ts-ignore
    const useCache: WeakUseFn<From, To> = (listen: Chain<From, To>): Chain<From, To> => {
        return (next: NextFn<To>, parameter: From, context: Context, status: any) => {
            const key = cache.config.key(parameter)
            if (key in cache.data) {
                return next(cache.data[key] as To)
            }

            return listen((value: To) => {
                if (!cache.config.isValid(value)) {
                    status.is = 'incomplete'
                    return
                }

                cache.data[key] = cache.config.sanitize(value)
                return next(cache.data[key])
            }, parameter, context, status)
        }
    }

    // @ts-ignore
    const hitCache: WeakHitFn<From, To> = (listen: Chain<To, To>): Chain<From, From | To> => {
        return (next: NextFn<From | To>, parameter: From, context: Context, status: any) => {
            const key = cache.config.key(parameter)
            if (key in cache.data) {
                return listen((value: To) => {
                    return next(value)
                }, cache.data[key], context, status)
            }

            return next(parameter)
        }
    }

    const wipe = () => {
        cache.data = {}
    }

    Object.assign(cache, {
        wipe,
        $: {
            use: useCache,
            hit: hitCache,
        }
    })

    return cache as WeakCacheObject<From, To>
}
