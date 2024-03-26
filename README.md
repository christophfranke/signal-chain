![size](https://deno.bundlejs.com/badge?q=signal-chain&treeshake=[{+default+as+$+}])
![npm](https://badgen.net/npm/v/signal-chain)

# Signal-Chain
## A Declarative Reactive Programming Library

**Signal-Chain** is a library for composing observables and asynchronous operations. It provides a core type, the Chain, several operators (select, effect, await, listen, combine, ...), and a reactive Primitive to combine declarative state management with asynchronous operations.

> Signal-Chain is a smaller and simpler RxJS.

The essential concepts of **Signal-Chain** are:

- **Primitive**: Represents a single reactive value.
- **Chain**: A series of operations. Can be connected to update a primitive.
- **Element**: A single operation in a chain. Every chain can be an element of another chain.
- **Listener**: A subscription to a reactive value. Can be an element in a chain.
- **Operator**: An element in a chain, that modifies the behaviour of a sub chain.

**Installation**:
```sh
npm install signal-chain
```

### Examples

**Getting Started**

Let's define a primitive.
```typescript
import $ from 'signal-chain'

const counter = $.primitive.create(0)
```

Now we can define a chain that listens to the counter and logs the value using the `effect` operator.
```typescript
const log = $.chain(
   counter.listen,
   $.effect(value => console.log(value))
)
```

When we connect the chain, it will start listening to the counter.
```typescript
const disconnect = $.connect(log) // logs: 0

counter.value = 1 // logs: 1
```

We can also rewrite the value into something different with the `select` operation.
```typescript
const formatted = $.chain(
   counter.listen,
   $.select(x => `The number is ${x}`)
)
```

And then we create a primitive that is connected to the formatted chain.
```typescript
const formattedValue = $.primitive.connect(formatted)

counter.value = 10
console.log(formattedValue.value) // logs: The number is 10
```

**Reusability**

In the above example, we formatted a counter value. Sometimes, we want to specify behaviour, but want to apply it to different sources. We can do that, by creating a chain that requires an input value.
```typescript
const format = $.chain(
   $.select<number>(x => Math.round(x)),
   $.if(x => x > 1)(
      $.select(x => `We have ${x} apples`)
   ),
   $.if(x => x === 1)(
      $.select(() => `We have an apple`)
   ),
   $.if(x => x === 0)(
      $.select(() => `We have no apples`)
   ),
   $.assert.isNumber(
      $.select(() => 'I cannot handle negative apples. Or NaN apples.')
   )
)
```

Here we have created a chain, that will format a number into a string. There are a few things going on:
- The first `$.select` has a type parameter `number`, that specifies that we expect a number as input. If we do not specify this, typescript will infer `unknown` and complain about the `Math.round(x)` operation. This is the recommended approach of defining input types. If the first operator is not a `$.select`, you can always add an empty select operation `$.select<ExpectedType>()`.
- The `$.if` operator is a higher order operator. That means, it expects a chain (or multiple elements) as a parameter. They define the *inner chain*. The *inner chain* will only execute, if the condition is true.
- The `$.assert` operator, also a higher order operator, is similar to the `$.if` operator, in that if the condition is met, the *inner chain* will execute. In contrast to the `$.if` operator, it performs static type inference. Here, all `number` input is rewritten into a `string` by the `$.select` operator, causing typescript to infer that the signal thereafter is always a `string`.

We can now use this chain to format a number.
```typescript
const counter = $.primitive.create(0)
const formatted = $.primitive.connect(
   counter.listen,
   format,
   $.effect(value => console.log(value)) // logs: We have no apples
)

counter.value = 10 // logs: We have 10 apples
console.log(formatted.value) // logs: We have 10 apples
```

**Asynchronous Operations**

Admittedly, this type of formatting could have been done with a simple function. Let us take this approach and combine it with some asynchronous logic, so we can see the real value of the chain.

Here, we will implement an auto suggest feature, that fetches some data from an API and logs the result.
```typescript
import $ from 'signal-chain'

// store user input into a reactive primitive
const input = $.primitive.create('')
document.getElementById('my-input')?.addEventListener('input', (event) => {
   input.value = (event.target as HTMLInputElement).value
})

// resolves after ms with input
const wait = <T>(input: T, ms: number) => new Promise<T>(
   resolve => setTimeout(
      () => resolve(input),
      ms
   )
)

const suggestions = $.primitive.connect(
   input.listen,

   // debounce 150ms
   $.await.latest(
      $.select(input => wait(input, 150)),
   ),
   $.assert.not.isError(), // type narrowing

   // fetch if input is long enough, otherwise fall back to empty array
   $.if((input: string) => input.length > 2, [])(
      $.select(input => `/api/suggest/${input}`),
      $.await.latest(
         $.select(url => fetch(url).then(response => response.json()) as Promise<string[]>),
      ),
      $.assert.isError(
         $.effect(err => console.error('Error fetching suggestions:', err)),
         $.select(() => [])
      ),
   ),

   $.log('Suggestions:') // Suggestions: ['So', 'many', 'suggestions', ...]
)
```
In this example we first store the user input in a reactive primitive. We use that to primitive as a starting point to define the chain to fetch the suggestions.

Let's have a look at the debounce part:
- The `$.await.latest` operator will pass on the latest resolved value. If a value is incoming while the previous promise is still pending, the previous promise will be cancelled and the resolve of the new one is awaited instead.
- Together with the wait function, this will effectively create a debounce, only passing on the input when there is no new value for 150 ms.

When given no argument, `$.assert.not.isError()` will pass on the value if it is not an error, otherwise it throws. We use it here to ensure type consistency: `$.await.latest` cannot know, if a promise will resolve or reject. Therefore, it passes on `TypeOfPromiseResolve | Error`. Because we know that our wait function cannot reject, we can safely assert that there is no error. The assertion operator then removes the `Error` type from the chain.

*Why* is it designed like this? It follows the principle of **errors as values**. This reminds the developer that at this place something can go wrong and we need to handle it somehow. If we were not to handle the error at all, the suggestion pimitive would have an inferred type of `string[] | Error`.

The `$.if` operator has a second parameter, which is the fallback value. If the condition is not met, the fallback value will be used instead. If no fallback is given and the condition is not met, the input is being passed through unchanged.

The `$.await.latest` is also exactly what we want in fetching data. If a new input is given while the previous request is still pending, the previous request will be cancelled. This is similar to the RxJS behviour of `switchMap`. For other scenarios there are 4 more await operators with different strategies:
- `$.await.parallel`: Passes on all resolved values in the order they resolve.
- `$.await.order`: Passes on all resolved values in the order they were requested.
- `$.await.block`: Will only enter the inner block when no promise is pending. Incoming values will be discarded.
- `$.await.queue`: Will only enter the inner block when no promise is pending. Incoming values will be queued and processed by the inner block once the pending promise is resolved.

**Reactivity with Plain Objects**

Sometimes you may work with existing logic, or maybe you prefer to store our state in plain objects. **Signal-Chain** can listen to plain objects and arrays using proxies.

Let's assumet we have a state object like this:
```typescript
const state = {
   filter: '',
   elements: [
      { age: 25, name: 'Alice' },
      { age: 73, name: 'Bob' },
      { age: 42, name: 'Charlie' },
      { age: 18, name: 'David' },
   ]
}
```

And let's further assume there is pre-existing logic spread out over the source code, that sets the filter and the elements. We can still listen to changes of the filter and the elements:
```typescript
const filter = $.primitive.connect(
   $.emit(state), // emit the state object
   $.listen.key('filter'), // listen to changes in the filter key
)
const elements = $.primitive.connect(
   $.emit(state), // emit the state object
   $.listen.key('elements'), // listen to changes in the elements key
)
```
- The `$.emit` operator has no input and emits the passed argument.
- The `$.listen.key` operator will listen to changes in the given key of the incoming object. Whenever the value changes, it will fire. If the value of the key is an array type, the listener will be attached to the array itself via proxy, so that any changes to the array will also be detected.

This is how we could implement a reactive filter:
```typescript
const filteredElements = $.primitive.connect(
   $.combine(
      elements.listen,
      filter.listen,
   ),
   $.select(
      ([elements, filter]) => elements.filter(
         element => element.name.includes(filter)
      )
   )
)
```
Here we use the `$.combine` operator, which takes a list of elements, and combines them into one element that emits an array. Whenever one of the elements fires with a new value, the combined element will fire with the latest values of all elements.

There is a subtle caveat in this example:
```typescript
state.filter = 'Alice' // this works as expected
state.elements.push({
   age: 42,
   name: 'Eve'
}) // this is also fine

state.elements[0] = {
   'Alicia',
   age: 53
} // also fine
state.elements[0].name = 'Bob' // this will not trigger the chain
```

The reason for that is, that although the `$.listen.key('elements')` listens to all array changes, the change to the name property of the array is not considered a change to the array itself. Also, `$.select` is not a reactive context. Only the `$.listen` operator is reactive. If we want to listen to changes to the keys of the objects, that are the elements of the array, we need to add another listener to the key:
```typescript
const names = $.chain(
   $.emit(state),
   $.listen.key('elements'),
   $.each(
      $.listen.key('name')
   )
)

```

The `$.each` operator is a higher order operator, that expects a chain as argument. It will apply the chain to each element of an array. In this case, it will listen to changes in the `name` key of each element in the `elements` array.

It is possible that future versions will have a `$.listen.select` operator, which is automatically reactive. For now, however, we have to subscribe manually, which on the other hand has the great benefit of being explicit.


**Types and Inferrence**

We have so far used code with minimal type information. *Signal-Chain* is fully typed and built with type inferrence in mind. In all the above examples we have complete inferrence. Typescript will also protect us from making any mistakes, like chaining the wrong chains together:

```typescript
const hallo = $.primitive.create('welt') // inferred as string
const formatted = $.primitive.connect(
   hallo.listen,
   $.select(x => Math.round(x)) // <-- typescript error:
   // Argument of type 'string' is not assignable to parameter of type 'number'.
)
```

Sometimes a little context is necessary
```typescript
const multiplicator = $.chain(
   $.select(x => x * 5) // <-- typescript error: x is unknown
)

const numberMultiplicator = $.chain(
   $.select<number>(x => x * 5) // now we are good
)
```

In case you do want to be more general, you need to use a function with a generic
```typescript
// creates a chain from T -> boolean
const truthyness = <T>() => $.chain(
   $.select((x: T) => !!x) // output type boolean inferred
)

const counter = $.primitive.create(0)
const somechain = $.chain(
   counter.listen,
   truthyness() // T gets inferred to number
)
```

Additionally, **Signal-Chain** includes these operators:

- `$.catch`: Catches errors and passes them on as values.
- `$.count`: Counts the number of incoming values.
- `$.collect`: Collects all incoming values.
- `$.listen.event`: Listens to DOM Events.
- `$.merge`: Merges multiple chains into a single one.
- `$.stop`: Stops the chain.
- `$.passIf`: Passes on the value if the condition is met.
- `$.stopIf`: Stops the chain if the condition is met.
- `$.ifNot`: Negation of `$.if` without fallback.
- `$.passUnique`: Passes only unique values.
- `$.assert.create`: Creates a custom assertion from a type predicate function.
- `$.assert.not.create`: Creates a custom negated assertion from a type predicate function.

### Documentation

For more detail, have a look at the official [documentation](https://christophfranke.github.io/signal-chain).
Please note, the documentation is still in progress.

### Known Issues

This is a very new library and there is no guarantee that the API is stable. Please use with caution and report any issues you encounter.

- When listening to an object key, and the key had an array type, but is now being assigned a non-array, the application throws an error unsupported.
- Options and behaviour of update batching and async updates is not stable yet. There are several options and there will be a way to turn on/off batching and asnyc, the default configuration may change though.

### Roadmap

- Rename `$.assert` to `$.type`, `$.assert.create` becomes `$.type.is`
- some quality of life utilities like `$.debounce` and `$.throttle`
- A `$.listen.select`, that is automatically reactive.
- Refactor the `Chain` type into `SyncChain` and `AsyncChain` and merge `$.evaluate.sync` and `$.evaluate.async`
