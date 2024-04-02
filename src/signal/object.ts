import type { NextFn, ConnectedChain, PrimitiveSignal } from './types'
import * as primitive from './primitive'
import { observeArray } from './array'

export function key<O extends Object, Key extends keyof O>(key: Key): ConnectedChain<O, O[Key]> {
    return (next: NextFn<O[Key]>, obj: O) => {
        return objectListener(obj, key)(next)
    }
}


export function objectListener<O extends Object, Key extends keyof O>(obj: O, key: Key): ConnectedChain<void, O[Key]> {
    // Check if the signal storage exists; if not, create it
    if (!obj.hasOwnProperty('__signals__')) {
        Object.defineProperty(obj, '__signals__', {
            value: {},
            enumerable: false, // Hide it from object iteration
            configurable: false, // Prevent deletion
            writable: false, // Prevent modification
        });
    }

    // Use an existing signal if available, or create a new one
    const signals: Record<string, PrimitiveSignal<O[Key]>> = (obj as any).__signals__;
    if (!signals[key as string]) {
        signals[key as string] = primitive.create(obj[key])

        let isArray = false
        let observableArray: any = []
        if (Array.isArray(obj[key])) {
            isArray = true
            observableArray = observeArray(obj[key] as any, signals[key as string].update)
        }

        Object.defineProperty(obj, key, {
            get() {
                // console.log('get object', { [key]: signals[key as string].value })
                if (isArray) {
                    return observableArray
                }
                return signals[key as string].value
            },
            set(newValue: O[Key]) {
                if (Array.isArray(newValue)) {
                    observableArray = observeArray(newValue, signals[key as string].update)
                }
                // console.log('update object', { [key]: newValue })
                signals[key as string].update(newValue)
            },
            enumerable: true,
            configurable: true,
        });
    }

    // Add the listener and return the cleanup function
    return signals[key as string].listen
}