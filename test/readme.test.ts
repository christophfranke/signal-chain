import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('readme', () => {
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