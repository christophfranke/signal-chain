import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('readme', () => {
    it('should get the poser exapmle right', async () => {
        const fetchMock = (..._: any[]) => new Promise<any>(res => res({
            status: 200,
            json() {
                return Promise<['hi', 'welt']>
            }
        }))

        // define a reactive primitive
        const input = $.primitive.create('')

        // update the input value when user type
        // document.getElementById('my-input')?.addEventListener('input', (event) => {
        //    input.value = (event.target as HTMLInputElement).value
        // })

        // fetchData is a Chain that can listen to the input field
        // and fetch data from the server when it changes.
        // Until it is connected, it will not do anything, similar to a function definition.
        // Once it is connected and a signal arrives,
        // the signal will traverse the chain from top to bottom producing a result
        const fetchData = $.chain(
           input.listen, // listen to changes
           $.if(input => input.length > 2,
              $.await.latest( // will discard all results but the latest
                 // make http request to search endpoint whenever user input is changed
                 $.select(
                    input => fetchMock(`/api/search?q=${input}`).then(res => res.json() as Promise<string[]>)
                 ),
              ),
              $.emit([]) // fallback to empty array if input is too short
           ),
           $.error.handle(
              $.error.log('API request failed:'),
              $.effect(error => window.alert(`Error: ${error.toString()}`)),
              $.stop() // stop execution of chain here
           )
        )

        // serverData is a reactive primitive.
        // $.primitive.connect takes a chain and connects it.
        // It will immediately send a signal through the chain
        // and write the result to the serverData primitive until disconnected.
        const serverData = $.primitive.connect(fetchData)

        // let's presume we have a filter string that can be changed by the user
        const filter = $.primitive.create('some filter string')

        // We can combine the server data and the filter to produce filtered results
        // With $.primitive.connect we can define the chain inline,
        // It will be connected immediately.
        const filteredResults = $.primitive.connect(
           $.combine(serverData.listen, filter.listen), // fires on any change
           $.select(([data, filter]) => data.filter(elem => elem.includes(filter)))
        )

        // let's define a reactive timer
        const timer = $.primitive.create(0)
        const intervalId = setInterval(() => { timer.value += 1 }, 1000) // update every second

        // If we do not care about the resulting values
        // we can use $.connect to connect a chain.
        // Here we can also define the chain inline.
        const disconnect = $.connect(
           timer.listen,
           $.await.parallel( // executes and resolves all promises as they come in
              // post tracking data to server
              $.select(() => fetchMock('/api/tracking/impressions', {
                 method: 'POST',
                 body: JSON.stringify(filteredResults.value)
              })),
           ),
           $.error.discard(), // we want only success here
           $.if(res => res?.status == 200,
              $.effect(() => console.log('Impression request success'))
           )
        )

        serverData.disconnect() // stop fetching
        filteredResults.disconnect() // stop filtering
        disconnect() // stop sending tracking data
        clearInterval(intervalId) // stop timer
    })

    it('should get the first example right', () => {
        // creates a reactive primitive, like a ref or a signal
        const counter = $.primitive.create(0)

        // chains are the core of signal-chain, they define a series of operations
        const format = $.chain(
            $.select<number>(x => Math.round(x)),
            // select is like map, but with a more distinctive name
            $.select(x => `The number is ${x}`),
        )

        const invert = $.chain(
            $.select<number>(x => -x),
        )

        // for a chain to become active, it needs to be connected
        $.connect(
            counter.listen, // listen to changes in counter
            invert, // apply invert chain
            format, // apply format chain
            $.effect(result => expect(result).toBe(`The number is ${-counter.value}`)) // log: The number is 0
        )

        counter.value = 10 // log: The number is -10
    })

    it('should get the second example right', () => {
        const mockfetch = (url: string) => Promise.resolve({ json: () => Promise.resolve({ a: url }) })
        type UserJSON = { a: string }

        // here we store the user name, initialized with undefined
        const user = $.primitive.create<string | undefined>(undefined)


        // here we define and connect the data fetching chain
        const data = $.primitive.connect( // connect will run eager and execute synchronously
            user.listen, // listen to user changes

            // type inferred: string | undefined
            $.type.isNothing( // type.isNothing catches null | undefined
                // the inside block will only be executed when the assertion is true,
                $.emit('guest') // in that case we emit 'guest' as our default
            ),

            // type inferred: string
            $.select(user => `/api/user/${user.toLowerCase()}`), // construct the url
            $.await.latest( // await.latest will only pass on the latest resolve
                $.select(url => mockfetch(url).then(response => response.json()) as Promise<UserJSON>),
            ),

            // type inferred: UserJSON | Error
            $.type.isError( // when a promise is rejected, its result will be a value of type Error
                $.effect(err => console.error('Error fetching data:', err)),
                $.stop() // no data, stop processing
            ),

            // type inferred: UserJSON
            $.effect(data => { expect(data.a).toBe(`/api/user/${user.value?.toLowerCase()}`) })
        )

        // now we set the user name, which will trigger data fetching
        user.value = 'Detlev' // logs: Data fetched: { ... }
        data.value // everything we know about Detlev, type UserJSON is inferred
    })

    it('should get the third example right', async () => {
        // this is just a plan javascript object
        const user = {
            meta: {
                profil: '/default.png',
                loggedIn: false,
                comments: [] as { a: string }[]
            },
            name: 'guest'
        }

        // up until here, we have plain javascript
        // we can now react to state updates without changing the existing code
        $.primitive.connect(
            $.emit(user), // emit the user object
            $.listen.key('meta'), // listen to the meta key
            // when the meta object changes, the comments listener gets reattached
            $.listen.key('comments'),
            // a proxy is used on the array to make sure we catch all changes
            $.select(comments => comments.length)
        )


        // or we could fetch some private data only for loggedIn users
        const mockfetch = (url: string) => Promise.resolve({ json: () => Promise.resolve({ a: url }) })
        type PrivateData = { a: string }
        const privateData = $.primitive.connect(
            $.emit(user), // emit the user object
            $.listen.key('meta'), // listen to changes in the meta object
            $.listen.key('loggedIn'), // when the meta object changes, this listener gets reattached
            $.if(
                loggedIn => !!loggedIn,
                $.chain(
                    $.emit(user),
                    $.listen.key('name'), // name changes when user account is switched without logout
                    // $.log('1'),
                    $.await.latest(
                        $.select(name => `/api/private/${name.toLowerCase()}`),
                        $.select(url => mockfetch(url).then(response => response.json()) as Promise<PrivateData>),
                    ),
                    // $.log('2'),
                    $.type.isError($.emit(undefined)), // emit undefined on error
                ),
                $.emit(undefined)
            ),
            // $.log('update private data'),
        )



        await new Promise(resolve => setTimeout(resolve, 0))

        let done: Function
        let values = [undefined, { a: '/api/private/detlev' }]
        privateData.listen(value => {
            if (values.length > 0) {
                expect(JSON.stringify(value)).toBe(JSON.stringify(values.shift()))
            }

            if (!values.length) {
                done()
            }
        })

        expect(privateData.value).toBe(undefined)

        user.meta.loggedIn = true
        user.name = 'Detlev'

        await new Promise(resolve => { done = resolve })
    })
})