import { NextFn } from "./types"

// list of methods that modify the array
const methods: PropertyKey[] = [
    'copyWithin',
    'fill',
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift'
]

export const observeArray = <T>(base: T[], update: any): T[] => {
    // @ts-expect-error idempotent
    if (base.__listen__) {
        // @ts-expect-error
        base.__listen__(update)
        return base
    }

    let listeners = [update]
    const handler = {
        // @ts-ignore
        get(target: T[], prop: PropertyKey, receiver: any) {
            if (prop === '__listen__') {
                return (newUpdate: NextFn<T[]>) => {
                    listeners.push(newUpdate)
                    return () => {
                        listeners = listeners.filter(fn => fn !== newUpdate)
                    }
                }
            }

            const reflection = Reflect.get(target, prop, receiver)
            if (typeof reflection === 'function' && methods.includes(prop)) {
                return function(...args: any[]) {
                    const result = reflection.apply(target, args)
                    listeners.forEach(fn => fn(target))

                    return result
                }
            }
            return reflection
        },

        set(target: T[], prop: PropertyKey, value: any, receiver: any): boolean {
            const result = Reflect.set(target, prop, value, receiver)

            listeners.forEach(fn => fn(target))
            return result
        }
    }

    return new Proxy(base, handler)
}

