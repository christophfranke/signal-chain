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
export type ChainType = 'sync' | 'async' | 'incomplete' | 'async-incomplete'
export type ChainStatus<CT extends ChainType = ChainType> = {
  is: CT
}
export type Chain<From, To = From, CT extends ChainType = ChainType> = (next: NextFn<To>, parameter: From, context: Context, status: ChainStatus<CT>) => CleanupExec
export type SyncChain<From, To = From> = Chain<From, To, 'sync' | 'async' | 'incomplete' | 'async-incomplete'>
export type AsyncChain<From, To = From> = Chain<From, To, 'async' | 'async-incomplete'>
export type WeakChain<From, To = From> = Chain<From, To, 'incomplete' | 'async-incomplete'>
export type AsyncWeakChain<From, To = From> = Chain<From, To, 'async-incomplete'>

export type ConnectedChain<From, To> = (next: NextFn<To>, parameter: From) => CleanupExec
export type Test = AsyncChain<number, number> extends SyncChain<number, number> ? true : false
export type Test2 = SyncChain<number, number> extends AsyncChain<number, number> ? true : false

