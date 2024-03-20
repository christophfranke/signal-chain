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

2. **Using Primitives**:
   ```typescript
   import $ from 'signal-chain'

   // creates a reactive primitive, like a ref or a signal
   const counter = $.primitive.create(0)

   // chains are the core of signal-chain, they define a series of operations
   const format = $.chain(
      $.select(x => Math.round(x)),
      // select is like map, but with a more distinctive name
      $.select(x => `The number is ${x}`),
   )

   const invert = $.chain(
      $.select(x => -x),
   )

   // for a chain to become active, it needs to be connected
   const disconnect = $.connect(
      counter.listen, // listen to changes in counter
      invert, // apply invert chain
      format, // apply format chain
      $.effect(result => console.log(result)) // log: The number is 0
   )

   counter.value = 10 // log: The number is -10
   ```

3. **Reactive Data Fetching**:

   Let's say we want to fetch some user data from an API and whenever the user changes, we need to fetch new data

   ```typescript
   import $ from 'signal-chain'

   type UserJSON = { ... }

   // here we store the user name, initialized with undefined
   const user = $.primitive.create<string | undefined>(undefined)


   // here we define and connect the data fetching chain
   const data = $.primitive.connect( // connect will run eager and execute synchronously
      user.listen, // listen to user changes

      // type inferred: string | undefined
      $.assert.isNothing( // assert.isNothing catches null | undefined
         // the inside block will only be executed when the assertion is true,
         $.emit('guest') // in that case we emit 'guest' as our default
      ),

      // type inferred: string
      $.select(user => `/api/user/${user.toLowerCase()}`), // construct the url
      $.await.latest( // await.latest will only pass on the latest resolve
         $.select(url => fetch(url).then(response => response.json()) as Promise<UserJSON>),
      ),

      // type inferred: UserJSON | Error
      $.assert.isError( // when a promise is rejected, its result will be a value of type Error
         $.effect(err => console.error('Error fetching data:', err)),
         $.stop() // no data, stop processing
      ),

      // type inferred: UserJSON
      $.log('Data fetched:')
   )

   // now we set the user name, which will trigger data fetching
   user.value = 'Detlev' // logs: Data fetched: { ... }
   data.value // everything we know about Detlev, type UserJSON is inferred
   ```

4. **Reactive State Management**:

   Sometimes there is existing logic, that we cannot easily change. Instead of trying to find every potential place in the code, that potentially updates an object or sets a key, we can set up a listener from inside a chain, that will wrap the targeted part of the object and automatically listen for any changes. That way, we can gradually extend the observer pattern into a code base, that has not been designed with reactivity in mind.


   ```typescript
   import $ from 'signal-chain'

   // this is just a plan javascript object
   const user = {
      meta: {
         profil: '/default.png',
         loggedIn: false,
         comments: []
      },
      name: 'guest'
   }

   // clicking the logout button will logout the user
   document.getElementById('logout')?.addEventListener('click', () => {
      user.name = 'guest'
      user.meta = {
         profile: '/default.png',
         loggedIn: false,
         comments: []
      }
   })

   // here we can select a user from a dropdown
   document.getElementById('my-user-select').addEventListener('change', (event) => {
      user.user = (event.target as HTMLSelectElement).value
      user.meta = {
         profil: `/profil/${user.user}.png`,
         loggedIn: true,
         comments: []
      }
   })

   // here we can add a comment to the user
   document.getElementById('add-comment').addEventListener('click', () => {
      user.meta.comments.push({ ... }) // push the new comment
   })


   // up until here, we have plain javascript
   // we can now react to state updates without changing the existing code
   const numberOfComments = $.primitive.connect(
      $.emit(user), // emit the user object
      $.listen.key('meta'), // listen to the meta key
      // when the meta object changes, the comments listener gets reattached
      $.listen.key('comments'),
      // a proxy is used on the array to make sure we catch all changes
      $.select(comments => comments.length)
   )

   // or we could fetch some private data only for loggedIn users
   type PrivateData = { ... }
   const privateData = $.primitive.connect(
      $.emit(user), // emit the user object
      $.listen.key('meta'), // listen to changes in the meta object
      $.listen.key('loggedIn'), // when the meta object changes, this listener gets reattached
      $.if(loggedIn => !!loggedIn)(
         $.emit(user),
         $.listen.key('name'), // name changes when user account is switched without logout
         $.await.latest(
            $.select(name => `/api/private/${name.toLowerCase()}`),
            $.select(url => fetch(url).then(response => response.json()) as Promise<PrivateData>),
         ),
         $.assert.isError($.emit(undefined)), // emit undefined on error
      ),
      $.ifNot(loggedIn => !!loggedIn)(
         // do not leak any data if not logged in
         $.select(() => undefined)
      )
   )

   console.log(
      privateData.value // type inferred: PrivateData | undefined
   )
   ```

The official documentation is in the making and will be available soon!


### Known Issues

This is a very new library and there is no guarantee that the API is stable. Please use with caution and report any issues you encounter.

- When listening to an object key, and the key had an array type, but is now being assigned a non-array, the application throws an error unsupported.
- Options and behaviour of update batching and async updates is not stable yet. There are several options and there will be a way to turn on/off batching and asnyc, the default configuration may change though.
- `$.if`, `$.ifNot` are not implemented yet, but will be soon.

