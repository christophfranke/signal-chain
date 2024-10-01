import { AsyncChain, AsyncWeakChain, Chain, SyncChain, WeakChain } from "../signal-ts"

export interface DiscardErrorFunction {
    <V1>(): SyncChain<V1, Exclude<V1 | undefined, Error>>
    <V1>(): AsyncChain<V1, Exclude<V1 | undefined, Error>>
    <V1>(): WeakChain<V1, Exclude<V1 | undefined, Error>>
    <V1>(): AsyncWeakChain<V1, Exclude<V1 | undefined, Error>>
}

export const discardError: DiscardErrorFunction = <V1>(): Chain<V1, Exclude<V1, Error> | undefined> => {
    return (next, parameter) => {
        if (parameter instanceof Error) {
            return next(undefined)
        }

        return next(parameter as Exclude<V1, Error>)
    }
}

export interface StopOnErrorFunction {
    <V1>(): WeakChain<V1, Exclude<V1 | undefined, Error>>
    <V1>(): AsyncWeakChain<V1, Exclude<V1 | undefined, Error>>
}

export const stopOnError: StopOnErrorFunction = <V1>(): Chain<V1, Exclude<V1, Error>> => {
    return (next, parameter) => {
        if (parameter instanceof Error) {
            return
        }

        return next(parameter as Exclude<V1, Error>)
    }
}


export interface PanicOnErrorFunction {
    <V1>(): SyncChain<V1, Exclude<V1, Error>>
    <V1>(): AsyncChain<V1, Exclude<V1, Error>>
    <V1>(): WeakChain<V1, Exclude<V1, Error>>
    <V1>(): AsyncWeakChain<V1, Exclude<V1, Error>>
}
export const panicOnError: PanicOnErrorFunction = <V1>(): Chain<V1, Exclude<V1, Error>> => {
    return (next, parameter) => {
        if (parameter instanceof Error) {
            throw parameter
        }

        return next(parameter as Exclude<V1, Error>)
    }
}


export interface LogErrorFunction {
    <V1>(text?: string): SyncChain<V1>
    <V1>(text?: string): AsyncChain<V1>
    <V1>(text?: string): WeakChain<V1>
    <V1>(text?: string): AsyncWeakChain<V1>
}
export const logError: LogErrorFunction = <V1>(text?: string): Chain<V1> => {
    return (next, parameter) => {
        if (parameter instanceof Error) {
            if (text) {
                console.error(text, parameter)
            } else {
                console.error(parameter)
            }
        }

        next(parameter)
    }
}