![size](https://deno.bundlejs.com/badge?q=signal-chain&treeshake=[{+default+as+$+}])
![npm](https://badgen.net/npm/v/signal-chain)

# Signal-Chain
## A Declarative Reactive Programming Library

**Signal-Chain** is a library for composing observables and asynchronous operations. It provides a core type, the Chain, several operators (select, effect, await, listen, combine, ...), and a reactive Primitive to combine declarative state management with asynchronous operations.

> Signal-Chain is a small and simple RxJS.

The essential concepts of **Signal-Chain** are:

- **Primitive**: Represents a single reactive value.
- **Chain**: A series of operations. Can be connected to update a *primitive*.
- **Operator**: Defines an operation in a *chain*. A *chain* itself can be an *operator* of another *chain*.
- **Signal**: A value/state, that runs from top to bottom through a *connected chain*, being manipulated according to the *operators* of the *chain*.
- **Listener**: A subscription to a reactive value. Can be an *operator* in a *chain*.

## Example

Taking these concepts together allows us to express complex behaviours in a declarative way:

```typescript
// define a reactive primitive
const input = $.primitive.create('')

// update the input value when user type
document.getElementById('my-input')?.addEventListener('input', (event) => {
   input.value = (event.target as HTMLInputElement).value
})

// fetchData is a Chain that can fetch data from the server
// Until it is connected, it will not do anything (like a function definition)
// When it is connected and a signal arrives,
// the signal will traverse the chain from top to bottom, producing an output
const fetchData = $.chain(
   input.listen, // listen to changes
   $.if(input => input.length > 2,
      $.await.latest(
         // make http request to search endpoint whenever user input is changed
         $.select(input => fetch(`/api/search?q=${input}`).then(res => res.json())),
      ),
      $.emit([]) // fallback to empty array if input is too short
   ),
   $.error.handle(
      $.error.log('API request failed:')
      $.stop() // stop execution of chain here
   )
)

// serverData is a reactive primitive.
// $.primitive.connect takes a chain and connects it,
// and will write all output to the serverData primitive.
const serverData = $.primitive.connect(fetchData)

// we can also define a chain inline and immediately connect it
const disconnect = $.connect(
   serverData.listen, // listen to incoming data
   $.effect(searchResults => {
      // do something with the data
      console.log('new search results:', searchResults)
   })
)

disconnect() // will stop printing new search results
```

When a *Chain* is *connected*, a *Signal* of runs from top to bottom through the *Chain*. Each *Operator* can change, delay, or stop the *Signal*. Some *Operators*, like the *listener* can trigger a new *Signal*. *Chains* can have output data, that can be stored in a *Primitive*. *Chains* can also have input data, like a function or a procedure that needs some arguments to run. *Chains* can also be chained together into new *Chains*, making them flexible and reusable. *Primitives*, *Operators* and *Chains* are fully typed and types are automatically inferred, making it impossible to chain incompatible data.

Error handling in Javascript is difficult: All kinds of things can throw. When a *Chain* throws, it breaks. **Signal-Chain** provides *Error Handling Operators* to catch and handle errors effectively, following the principles of *Errors as Value*.

## Documentation

**Installation**:
```sh
npm install signal-chain
```

### Primitives

Let's define a primitive.
```typescript
import $ from 'signal-chain'

const counter = $.primitive.create(0)
```

A primitive is a container holding a single reactive value. We can access and update the value directly.
```typescript
counter.value = 1
console.log(counter.value) // logs: 1
```

> While primitives theoretically work with Objects and Arrays, it is strongly discouraged to use those, because change is detected on assignment. There is no deep proxy that will listen for changes of the Object properties or Array elements. If you want to work with Objects and Arrays, use instead `$.listen.key` or `$.each`.

We can also listen to changes of the counter.
```typescript
const disconnect = counter.listen(newValue => {
   console.log('new value:', newValue) // logs: new value: 1
})

counter.value = 10 // logs: new value: 10
disconnect()
counter.value = 0 // silence
```

Note, that the listen fires immediately with the current value.

We can also return a cleanup function, that is being executed before the next value is passed in and on disconnect.
```typescript
const el = document.createNode('p')
const disconnect = counter.listen(value => {
   el.innerHTML = `Value is ${value}.`
   body.appendChild(el)
   return () => {
      body.removeChild(el)
   }
})
```
Whenever the value changes, the paragraph will be updated. When the listener is disconnected, the paragraph will be removed from the body.

This example has a serious downside though: We remove and append the element each time a value is updated, which feels somewhat wasteful. We can improve on this by using the parameter passed to the cleanup: A `boolean` that is true on disconnect.

```typescript
const el = document.createNode('p')
body.appendChild(el)

const disconnect = counter.listen(value => {
   el.innerHTML = `Value is ${value}.`
   return final => {
      if (final) {
         body.removeChild(el)
      }
   }
})
```

### Chains

Now that we have seen how *Primitives* work, we will use *Chains* to operate on *Primitives*. A *Chain* gives us the ability to define a series of operations that can be combined and reused. As opposed to the `listen` function of a *Primitive*, a *Chain* will not execute before it is connected.

We can use the `listen` function of a *Primitive* as an *Operator* in a *Chain* and combine it with a other *Operators*:
- `$.select`: Maps the incoming value to a new value.
- `$.effect`: Executes a side effect. Like in the `listen` function we can return a cleanup.

```typescript
const counter = $.primitive.create(1)

const logSquare = $.chain(
   counter.listen,
   $.select(value => value * value),
   $.effect(value => console.log(value))
)
```

The *Chain* type is broken down into multiple subtypes:
- `SyncChain`: This *Chain* executes **synchronously** and will **complete**
- `AsyncChain`: This *Chain* executes **asynchronously** and will **complete**
- `WeakChain`: This *Chain* executes **synchronously**, but may **not complete**
- `AsyncWeakChain`: This *Chain* executes **asynchronously** and may **not complete**

These types give static hints about the behaviour of the *Chain* and when used with `$.evaluate` or `$.function` will produce slightly different results.

Once we connect the chain, it will start listening to the counter. Note that it executes immediately and synchronously on connection.
```typescript
const disconnect = $.connect(logSquare) // logs: 1

counter.value = 2 // logs: 4
disconnect()
counter.value = 3 // silence
```

We can also store the result of the chain in a primitive.
```typescript
const squared = $.chain(
   counter.listen,
   $.select(value => value * value)
)
const squaredValue = $.primitive.connect(squared)

counter.value = 10
console.log(squaredValue.value) // logs: 100
```

The *Primitive* `squaredValue` behaves like a computed value. Its value will update whenever the *Signal* of its *Chain* reaches the end. Because it is a regular *Primitive*, it can be used in other *Chains*.

> The updates follow a push model: A connected chain will run, no matter how many subscribers its computed primitive has.

### Reusability

In the above example, we squared a counter value. Sometimes, we want to specify behaviour, but want to be able to apply it to different sources later. We can do that, by creating a chain that requires an input value.
```typescript
const appleFormat = $.chain(
   $.select<number>(x => Math.round(x)),
   $.if(
      x => x > 1,
      $.select(x => `We have ${x} apples`),
      $.if(
         x => x === 1,
         $.select(() => `We have an apple`),
         $.if(
            x => x === 0,
            $.select(() => `We have no apples`),
            $.chain(
               $.effect(x => console.error(`Cannot have ${x} apples. Stop updates.`)),
               $.stop()
            )
         ),
      ),
   ),
)
```

Here we have created a *Chain*, that will format a number into a string. Let us look at the *Operators* and their **Types** specifically:

The first `$.select` has a type parameter `number`, which specifies that we expect a number as input. If we do not specify this, Typescript will infer `unknown` and complain about the `Math.round(x)` operation. This is the recommended approach of defining input types for chains. It is possible to use an empty select operation `$.select<ExpectedType>()`. If you pass a second type parameter for `$.select` it will define the output type. The typesystem is setup in a way to require minimum type annotations and infer as much as possible.

The `$.if` operator expects a condition function as first parameter, the second parameter is a chain if the condition is met, and the third parameter if the condition is not met. We can see that if `x > 1`, it will produce a `string`, otherwise go into the next statement `x === 1`, if met produce a `string`, if `x === 0` it will produce a `string`.

If none of the statements hold, it will call `$.stop`, which stops the *Signal*, and produces the type `never`.

This results in `appleFormat` being of type `WeakChain<number, string>`, a *Chain* that requires a `number` input and will produce a `string` output or not finish.

We can now use this chain to format a number.
```typescript
const counter = $.primitive.create(0)
const formatted = $.primitive.connect(
   counter.listen,
   appleFormat,
   $.effect(value => console.log(value)) // logs: We have no apples
)

counter.value = 10 // logs: We have 10 apples
console.log('formatted ->', formatted.value) // logs: formatted -> We have 10 apples

counter.value = -1 // logs error: I don't like -1 apples
console.log('formatted ->', formatted.value) // logs: formatted -> We have 10 apples
```

When `counter.value = -1`, the *Chain* did not complete, and therefore not update the formatted value.

### Asynchronous Operations

Admittedly, this type of formatting could have been done more easy with a traditional function. Let us take this approach and combine it with some asynchronous logic. This is a main strength of **Signal-Chain**: It allows to define asynchronous reactive behaviour in a declaritive way.

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
   $.error.discard(), // promises can be rejected, but our wait function never fails

   // fetch if input is long enough, otherwise fall back to empty array
   $.if(input => input?.length > 2,
      $.chain(
         $.select(input => `/api/suggest/${input}`),
         $.await.latest(
            $.select(url => fetch(url)),
            $.select(async response => (await response).json() as Promise<string[]>),
         ),
         $.error.handle(
            $.effect(err => console.error('Error fetching suggestions:', err)),
            $.select(() => []) // fallback to empty array
         ),
      ),
      $.emit([])
   ),

   $.log('Suggestions:') // Suggestions: ['So', 'many', 'suggestions', ...]
)
```
In this example we first store the user input in a reactive primitive. We use that primitive as a starting point to define the chain to fetch the suggestions.

Let's have a look at the debounce part:
- The `$.await.latest` operator will pass on the latest resolved value. If a value is incoming while the previous promise is still pending, the previous promise will be cancelled and the resolve of the new one is awaited instead.
- Together with the wait function, this will effectively create a debounce, only passing on the input when there is no new value for 150 ms.

The `$.await.latest` operator will resolve the promise or pass on an `Error` if the promise is rejected. Its output type is `TypeOfPromiseResolve | Error`. In this case we know, that `wait` cannot reject, so we can safely discard the error.

This design follows the principle of **errors as values**. It reminds the developer that something can go wrong here and need be handled. If we remove the error handling code from the *Chain*, the resulting suggestion pimitive would have an inferred type of `string[] | Error`. Because the promise is being used inside `$.await.latest`, the rejection will be caught and passed on.

The `$.if` operator has a third parameter, which is the negative condition *Chain*: If the condition is not met, a fallback value will emitted. If there is no negative branch and the condition is not met, the input is being passed through unchanged.

The `$.await.latest` is also exactly what we want in fetching data. If a new input is given while the previous request is still pending, the previous request will be discarded. This is similar to the RxJS behviour of `switchMap`. For other scenarios there are 4 more await operators with different strategies:
- `$.await.parallel`: Passes on each resolved value as soon as it resolves.
- `$.await.order`: Passes on resolved values in the order they were requested.
- `$.await.block`: Will only enter the inner block when no promise is pending. Incoming values will be discarded.
- `$.await.queue`: Will only enter the inner block when no promise is pending. Incoming values will be queued and processed by the inner block once the pending promise is resolved.

### Reactivity with Plain Objects

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

In order for the `$.listen.key` operator to work on the object, it inserts a proxy in place of the object key resp. array. The proxy is designed to not interfere with the object itself, but it will make the object appear slightly different, for example on `console.log` operations.


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
state.filter = 'Alice' // this will trigger the filter chain to update
state.elements.push({
   age: 42,
   name: 'Eve'
}) // so will this

state.elements[0] = {
   'Alicia',
   age: 53
} // and this
state.elements[0].name = 'Bob' // this will not trigger the chain
```

The reason for that is, that although the `$.listen.key('elements')` listens to all array changes, the change to the name property of the array is not considered a change to the array itself. Also, `$.select` is not a reactive context. If we want to listen to changes to the keys of the objects, that are the elements of the array, we need to add another listener to the key:
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

### Types and Inferrence

We have so far used code with minimal type information. *Signal-Chain* is fully typed and built with type inferrence in mind. In all the above examples we have complete inferrence. Typescript will also protect us from making any mistakes, like chaining the wrong chains together:

```typescript
const hallo = $.primitive.create('welt') // inferred as string
const formatted = $.primitive.connect(
   hallo.listen,
   $.select(x => Math.round(x)) // <-- typescript error:
   // Argument of type 'string' is not assignable to parameter of type 'number'.
)


const squareRoot = $.chain(
   $.select<number>(x => Math.sqrt(x))
)
const toFixed = $.chain(
   $.select((x: number) => x.toFixed(2))
)

$.chain(toFixed, squareRoot) // <-- typescript error:
// toFixed returns a string, but squareRoot expects a number
```

Sometimes we need to explicitly define the type of a chain, because it is impossible to infer.
```typescript
const multiplicator = $.chain(
   $.select(x => x * 5) // <-- typescript error: x is unknown
)

const numberMultiplicator = $.chain(
   $.select<number>(x => x * 5) // now we are good
)
```

In some cases, we would like the type to be inferred by usage. We can use Typescript *Generics* to achieve that. In order for this to work, we need to define a function, that returns a chain, because values cannot be generic in Typescript.
```typescript
// creates a chain from T -> boolean
const truthyness = <T>() => $.chain(
   $.select((x: T) => !!x) // output type boolean inferred
)

const counter = $.primitive.create(0)
const somechain = $.chain(
   counter.listen,
   truthyness() // T gets inferred to number
) // somechain is inferred as Chain<void, boolean>
```

### Operators

Here is a list of all operators available in **Signal-Chain**:

**Basic Operators**
- `$.emit`: Emits a value.
- `$.select`: Selects a new value from an incoming value.
- `$.maybe.select`: Selects if the value is not undefined or null.
- `$.effect`: Executes a side effect.
- `$.log`: Logs the incoming value.
- `$.catch`: Catches errors in the *inner Chain* and passes them on as values.
- `$.count`: Counts the number of incoming values.
- `$.merge`: Merges multiple chains into a single one. Result is the latest value of the chain that fired, left is evaluated before right.
- `$.combine`: Combines multiple chains into a single one. Result is an array of the latest value of each chain.

**Async Operators**
- `$.await.latest`: Waits for the latest promise to resolve.
- `$.await.parallel`: Passes on each resolved value as soon as it resolves.
- `$.await.order`: Passes on resolved values in the order they were requested.
- `$.await.block`: Will only enter the inner block when no promise is pending. Incoming values will be discarded.
- `$.await.queue`: Will only enter the inner block when no promise is pending. Incoming values will be queued and processed by the inner block once the pending promise is resolved.

**Error Operators**
- `$.error.log`: Logs a passing Error value.
- `$.error.handle`: Enters the *inner Chain* when passing an Error value.
- `$.error.discard`: Turns an Error value into and undefined.
- `$.error.log.panik`: Throws incoming Error value and breaks the chain.

**Array Operators**
- `$.collect`: Collects all incoming values.
- `$.buffer`: Buffers incoming values.
- `$.window`: Collects incoming values showing a window of the last [n] values as array.
- `$.each`: Applies a chain to each element of an array.

**Reactive Operators**
- `$.listen.key`: Listens to a key of an object.
- `$.listen.event`: Listens to DOM Events.
- `$.maybe.listen.key`: Listens to a key if the value is not undefined or null.

**Flow Control Operators**
- `$.stop`: Stops the chain.
- `$.passIf`: Passes on the value if the condition is met.
- `$.stopIf`: Stops the chain if the condition is met.
- `$.if`: Conditional execution of a chain.
- `$.ifNot`: Negation of `$.if`.
- `$.debounce`: Debounces the incoming values. Incoming Errors will not be debounced.

**Efficiency Operators**
- `$.unique.select`: Select value, only pass on if mapped value is unique
- `$.unique.pass`: Passes only unique values.
- `$.uniqe.chain`: Only pass on if result of the *inner Chain* is unique. Fires always receives new value.

**Type Operators**
- `$.type.is`: Creates a custom type assertion from a type predicate function.
- `$.type.not.is`: Creates a custom negated type assertion from a type predicate function.
- `$.type.isNothing`: Enters *inner Chain* if type is `null` or `undefined`.
- `$.type.isNumber`: Enters *inner Chain* if type is `number`.
- `$.type.isArray`: Enters *inner Chain* if type is `Array`.
- `$.type.isBoolean`: Enters *inner Chain* if type is `boolean`.
- `$.type.isString`: Enters *inner Chain* if type is `string`.
- `$.type.isFunction`: Enters *inner Chain* if type is `Function`.
- `$.type.isObject`: Enters *inner Chain* if type is `Object`.
- `$.type.isError`: Enters *inner Chain* if type is `Error`.
- `$.type.not.isNothing`: Enters *inner Chain* if type is not `null` or `undefined`.
- `$.type.not.isNumber`: Enters *inner Chain* if type is not `number`.
- `$.type.not.isArray`: Enters *inner Chain* if type is not `Array`.
- `$.type.not.isBoolean`: Enters *inner Chain* if type is not `boolean`.
- `$.type.not.isString`: Enters *inner Chain* if type is not `string`.
- `$.type.not.isFunction`: Enters *inner Chain* if type is not `Function`.
- `$.type.not.isObject`: Enters *inner Chain* if type is not `Object`.
- `$.type.not.isError`: Enters *inner Chain* if type is not `Error`.

### Breaking out of the Chain

For compatibility with the rest of the Javascript world, there are two utility functions:

`$.evaluate` evaluates a *Chain* as a one-shot.
```typescript
const counter = $.primitive.create(0)

console.log($.evaluate(counter.listen)) // logs: 0
counter.value = 10
console.log($.evaluate(counter.listen)) // logs: 10
```

`$.function` creates a function that internally evaluates the *Chain*.
```typescript
const double = $.chain(
   $.select(x => x * 2)
)

const doubleFunction = $.function(double)
console.log(doubleFunction(5)) // logs: 10
```

Depending on the type of the chain, the result of `$.evaluate` and `$.function` will be slightly different:
- `SyncChain`: Will return the value of the chain.
- `AsyncChain`: Will return a promise that resolves to the value of the chain.
- `WeakChain`: Will return the value of the chain, or `undefined` if the chain did not complete.
- `AsyncWeakChain`: Will return a promise that resolves to the value or `undefined`, or `undefined` if the chain did not complete. This is because the chain may or may not complete before or after it becomes asynchronous.

### Controlling Update Behaviour

The default behaviour for updating *Primitives* is to batch updates and execute them asynchronously as microtasks. For example:

```typescript
const counter = $.primitive.create(0)
$.connect(
   counter.listen,
   $.log('value') // logs: value 0
)

counter.value = 1
counter.value = 2
counter.value = 3

// stop execution and give a chance to run queued microtasks
await Promise.resolve()

// logs: value 3
```

This is desirable on most cases. However, there are cases where we want to execute updates synchronously. You can either change the behaviour globally using `$.config`
```typescript
$.config({ update: 'sync' }) // synchronous updates, batching turned off
$.config({ update: 'timeout' }) // use macrotasks for updates
$.config({ batch: false }) // turn off batching
$.config({ update: 'microtask', batch: false }) // no batching, use microtasks for updates
console.log($.config()) // log the current configuration
```

Alternatively, you can pass a config when creating a primitive, that will only affect this primitive:
```typescript
const counter = $.primitive.create(0, { update: 'sync' })
$.connect(
   counter.listen,
   $.log('value') // logs: value 0
)

counter.value = 1 // logs: value 1
counter.value = 2 // logs: value 2
counter.value = 3 // logs: value 3
```

This can be especially useful when you want to use the primitive as a queue to push in tasks.

### Integration with Frontend Frameworks

**Signal-Chain** can be used with SolidJS, using the wrapper `signal-chain-solid`:
https://www.npmjs.com/package/signal-chain-solid

### Documentation

This was a brief overview of the **Signal-Chain** library. There is an effort to create a comprehensive documentation to cover all operators and concepts. However, the current focus is on inlining the documentation, so it is available in the editor via Typescript LSP.

### Known Issues

This is a very new library and there is no guarantee that the API is stable. Please use with caution and report any issues you encounter.

- The interface design of `$.if` makes it impossible to infer the type of the condition, making it necessary to specify the type of the condition explicitly.
- `$.passIf`, `$.stopIf` and `$.stop` can lead to unexpected cleanup behaviour, in some cases not correctly calling the final cleanup.

### Roadmap

- Some quality of life utilities like `$.throttle`
- Operator `$.while` to repeat a chain until a condition is met (e.g. retry failed http request).
- A `$.listen.select`, that is automatically reactive.
- Add integration wrappers for VueJS and React.
- `$.await.select` operator for more intuitive promise chaining.
- Operator `$.cache` to cache the values using a key function.
- `$.reactive` to create reactive objects that are also iteratable.
- `$.list` to create reactive lists that have fine grained updates for add/remove/update operations
