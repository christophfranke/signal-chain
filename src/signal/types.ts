export type FunctionVoid = () => void
export type Function0<R = void> = () => R
export type Function1<A, R = void> = (a: A) => R
export type Function2<A, B, R = void> = (a: A, b: B) => R

export interface FunctionOptional1<A, R = void> {
  (): R
  (a: A): R
}

type Falsy = false | null | undefined | 0 | ''
export type Maybe<T> = T | null | undefined

export type Executable<Func> = void | Falsy | Func | Executable<Func>[]


export type CleanupExec = Executable<Function1<boolean, void>>

export type ListenerDescription<V> = {
  cleanup: CleanupExec,
  fn: NextFn<V>
}


export type PrimitiveSignal<V> = {
  listen: ConnectedChain<void, V>
  update: FunctionOptional1<V>
  value: V
  disconnect: FunctionVoid
}

export type PrimitiveReadonly<V> = {
  listen: ConnectedChain<void, V>
  value: V
  disconnect: FunctionVoid
}


export type NextFn<V> = (value: V) => CleanupExec
export type Context = {
  [key: string]: any
}
export type Chain<From, To = From> = (next: NextFn<To>, parameter: From, context: Context) => CleanupExec
export type ConnectedChain<From, To> = (next: NextFn<To>, parameter: From) => CleanupExec
