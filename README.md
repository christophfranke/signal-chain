# Signal-Chain: A Declarative Reactive Programming Library
## Simplify State Management in Web Applications

**Signal-Chain** is a library for composing observables and asynchronous operations. It provides a core type, the Chain, several operators (select, effect, await, listen, combine, ...), and a reactive Primitive to combine declarative state management with asynchronous operations.

Think of Signal-Chain as RxJS for the grug developer.

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

Here we have created a chain, that will format a number into a string. There are a few things going on here:
- The first `$.select` has a type parameter `number`, that specifies that we expect a number as input. If we do not specify this, typescript will infer `unknown` and complain about the `Math.round(x)` operation.
- The `$.if` operator will only execute the inner chain, if the condition is true.
- The `$.assert` operator is similar to the `$.if` operator, in that if the condition is met, the inner chain will execute. In contrast to the `$.if` operator, it performs static type inference. In this case, all `number` input is rewritten into a `string` be the `$.select` operator, so typescript can infer that the signal after the assertion block is always a `string`.

We can now use the chain to format any number.
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

Here, we will implement a auto suggest feature, that fetches some data from an API and logs the result.
```typescript
import $ from 'signal-chain'

// store user input into a reactive primitive
const input = $.primitive.create('')
document.getElementById('my-input')?.addEventListener('input', (event) => {
   input.value = (event.target as HTMLInputElement).value
})

// utility function we will use for debounce
// resolves the promise to the input after the given time
const wait = <T>(input: T, ms: number) => new Promise<T>(resolve => setTimeout(() => resolve(input), ms))

const suggestions = $.primitive.connect(
   input.listen,

   // debounce
   $.await.latest(
      $.select(input => wait(input, 150)),
   ),
   $.assert.not.isError(),

   // ensure long enough input, if not, fallback to empty array
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
In this example we first store the user input in a reactive primitive and use it as input for the suggestions chain.
Let's have a look at the debounce part:
- The `$.await.latest` operator will only pass on the latest resolved value. If a value is incoming while the previous promise is still pending, the previous promise will be cancelled.
- Together with the wait function, this will effectively create a debounce, only passing when there is no user input for 150ms.

When given no argument, `$.assert.not.isError()` will only pass on the value if it is not an error, otherwise it throws. We use it here to ensure type consistency: `$.await.latest` cannot know, if a promise will resolve or reject. Therefore, it passes on `ValueType | Error`. because we know that our wait function cannot reject, we can safely assert that there is no error. The assertion then removes the `Error` type from the chain.

The `$.if` operator has a second parameter, which is the fallback value. If the condition is not met, the fallback value will be used instead. This defaults to the input of the operator, so if no fallback is given and the condition is not met, the input is being passed through.

The `$.await.latest` is also exactly what we want in fetching data. If a new input is given while the previous request is still pending, the previous request will be cancelled. There are 4 more await operators for different strategies:
- `$.await.parallel`: Passes all resolved values in the order they resolve.
- `$.await.order`: Passes all resolved values in the order they were requested.
- `$.await.block`: Will only enter the inner block when no promise is pending. Incoming values will be discarded.
- `$.await.queue`: Will only enter the inner block when no promise is pending. Incoming values will be queued and processed by the inner block once the pending promise is resolved.

**Reactivity with Plain Objects**

Sometimes you may work with existing logic, or maybe you prefer to store our state in plain objects. *Signal-Chain* can listen to plain objects and arrays using proxies.

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
The `$.emit` operator has no input and emits the passed argument.
The `$.listen.key` operator will listen to changes in the given key of the incoming object. If the value of the key is an array type, the listener will be attached to the array itself via proxy, so that any changes to the array will also be detected.

This is how we could implement a reactive filter:
```typescript
const filteredElements = $.primitive.connect(
   $.combine(
      elements.listen,
      filter.listen,
   ),
   $.select(([elements, filter]) => elements.filter(element => element.name.includes(filter)))
)
```
Here we use the `$.combine` operator, which takes a list of elements, and combines them into one element that emits an array. Whenever one of the elements fires with a new value, the combined element will fire with the latest values of all elements.

**Types and Inferrence**

We have so far used code with minimal type information. *Signal-Chain* is fully typed and built with type inferrence in mind. In all the above examples we have complete inferrence. Typescript will also protect us from making any mistakes, like chaining the wrong chains together:

```typescript
const counter = $.primitive.create('hallo') // <-- wait, this is a string!
const formatted = $.primitive.connect(
   counter.listen,
   $.select(x => 2 * x) // <-- typescript error: The rhs of an arithmetic operation must be a number...
)
```

Sometimes a little context is necessary
```typescript
const multiplicator = $.chain(
   $.select(x => x * 5) // <-- typescript error: x is unknown
)

const numberMultiplicator = $.chain(
   $.select<number>(x => x * 5) // no we are good
)
```

In case you do want to be more general, you need to use a function with a generic
```typescript
// creates a chain from T -> boolean
const truthyness = <T>() => $.chain(
   $.select((x: T) => !!x)
)

const counter = $.primitive.create(0)
const somechain = $.chain(
   counter.listen,
   truthyness() // T gets inferred to number
)
```

### Documentation

For more detail, have a look at the official [documentation](https://christophfranke.github.io/signal-chain).


### Known Issues

This is a very new library and there is no guarantee that the API is stable. Please use with caution and report any issues you encounter.

- When listening to an object key, and the key had an array type, but is now being assigned a non-array, the application throws an error unsupported.
- Options and behaviour of update batching and async updates is not stable yet. There are several options and there will be a way to turn on/off batching and asnyc, the default configuration may change though.


