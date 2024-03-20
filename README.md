# Signal-Chain: A Declarative Reactive Programming Library
## Simplify State Management in Web Applications

**signal-chain** is a declarative reactive programming library aimed at streamlining state management and data flow in web applications. By focusing on a minimal set of reactive primitives and constructs, it offers a powerful yet straightforward approach to building dynamic web interfaces. Unlike traditional reactive programming libraries that overwhelm with an extensive array of operators and concepts, **signal-chain** focuses on simplicity, readability and reusability, ensuring that your projects remain manageable and scalable.

### Features

#### State Management

1. **Reactive Primitives**: Supports defining state as reactive signals.
2. **Reactivity to Data**: Detects changes in plain objects and arrays using proxies.
3. **Reactivity to Events**: Allows subscriptions to DOM events.

#### Declarative and Asynchronous Operations

4. **Declarative Syntax**: Defines data flows and reactive operations.
5. **Async Operations**: Integrates asynchronous tasks with the reactive model.
6. **Error Handling**: Adopts an errors-as-values philosophy, supported by TypeScript typing.

#### Composition

7. **Chain Functionality**: Combines elements into chains for cohesive data flows.
8. **Reusability**: Chains can be reused and incorporated into other chains.
9. **Activation on Connection**: Chains are activated upon connection, allowing modular construction.

#### Additional Features

10. **Performance**: Optimized for low runtime overhead with a small library footprint (<10k).
11. **TypeScript Support**: Fully typed, focusing on type inference.


### Installation and Usage Instructions

To start using **signal-chain** in your projects, follow these steps:

1. **Installation**:
   ```sh
   npm install signal-chain
   ```

2. **Basic Usage**:
   ```typescript
   import $ from 'signal-chain'
   
   const counter = $.primitive.create(0)
   const format = $.chain(
      $.select(x => Math.round(x)),
      $.select(x => `The number is ${x}`),
   )

   const invert = $.chain(
      $.select(x => -x),
   )

   const disconnect = $.connect(
      counter.listen,
      invert,
      format,
      $.effect(result => console.log(result)) // The number is 0
   )

   counter.value = 10 // The number is -10


   // and a more real world scenario
   type ResponseJSON = { ... }
   const endpoint = $.primitive.create<string | undefined>(undefined)
   const data = $.primitive.connect(
      endpoint.listen,
      $.assert.isNothing( // nothing catches null | undefined
         $.emit('/') // default to root
      ),
      $.await.latest( // await.latest ensures that only the latest request result is being passed on
         $.select(url => fetch(url).then(response => response.json()) as Promise<ResponseJSON>),
      ),
      $.assert.isError( // when a promise rejects, its result will be an error
         $.effect(err => console.error('Error fetching data:', err)),
         $.stop()
      ),
      // strong type inferrence: the error has been asserted for, so the result must be a ResponseJSON
      $.log('Data fetched:')
   )

   endpoint.value = '/api/endpoint1' // Data fetched: { ... }
   data.value // holds fetched data, type ResponseJSON inferred

   ```

For more detailed documentation and advanced usage examples, refer to the official documentation.


### Known Issues

This is a very new library and there is no guarantee that the API is stable. Please use with caution and report any issues you encounter.


