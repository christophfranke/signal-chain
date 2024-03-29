import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'


describe('async', () => {
    it('should only resolve the latest value', async () => {
        const resolves = [] as Function[]
        // no batching for input, triggering the chain on every set of input
        const input = $.primitive.create('init', { update: 'sync' })
        const latest = $.primitive.connect(
            input.listen,
            $.await.latest(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.type.isError($.stop()),
        )

        input.value = 'second'
        input.value = 'third'

        // not yet finished
        expect(latest.value).toBe(undefined)

        resolves.reverse()
        resolves.forEach(resolve => resolve())

        // give a chance to run promises
        await Promise.resolve()

        // all but the latest value have been discarded
        expect(latest.value).toBe('third')
    })

    it('should resolve all values when resolved', async () => {
        const resolves = [] as Function[]
        const input = $.primitive.create('init',  { update: 'sync' })
        const latest = $.primitive.connect(
            input.listen,
            // $.log('input'),
            $.await.parallel(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.type.isError($.stop()),
            // $.log('parallel')
        )


        input.value = 'second'
        input.value = 'third'

        // not yet finished
        expect(latest.value).toBe(undefined)

        // now resolve in random order
        resolves[1]()
        await Promise.resolve()
        expect(latest.value).toBe('second')

        resolves[0]()
        await Promise.resolve()
        expect(latest.value).toBe('init')

        resolves[2]()
        await Promise.resolve()
        expect(latest.value).toBe('third')
    })

    it('should resolve values in order of appearence', async () => {
        const resolves = [] as Function[]
        const input = $.primitive.create('init',  { update: 'sync' })
        const latest = $.primitive.connect(
            input.listen,
            $.await.order(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.type.isError($.stop()),
            // $.log('order'),
            $.collect(),
            // $.log('collected')
        )


        input.value = 'second'
        input.value = 'third'

        // not yet finished
        expect(latest.value).toBe(undefined)

        // now resolve in random order
        resolves[1]()
        resolves[0]()
        resolves[2]()

        // I do not know why, but we need to wait for a timeout here for all promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(latest.value).toEqual(['init', 'second', 'third'])
    })

    it('should queue incoming values before start resolving', async () => {
        let resolves = [] as Function[]
        const input = $.primitive.create('init',  { update: 'sync' })
        const latest = $.primitive.connect(
            input.listen,
            $.await.queue(
                // $.log('in queue'),
                $.select(x => new Promise<string>(resolve => {
                    const fn = () => {
                        resolve(x)
                        resolves = resolves.filter(r => r !== fn)
                    }
                    resolves.push(fn)
                }))
            ),
            $.type.isError($.stop()),
            $.collect(),
        )

        // wait for initial promise to be initialized
        await new Promise(resolve => setTimeout(resolve, 0))
        expect(resolves.length).toBe(1)
        expect(latest.value).toBe(undefined)

        // add two more values
        input.value = 'second'
        input.value = 'third'

        // start resolving
        resolves[0]()

        await new Promise(resolve => setTimeout(resolve, 0))
        expect(resolves.length).toBe(1)
        resolves[0]()

        await new Promise(resolve => setTimeout(resolve, 0))
        expect(resolves.length).toBe(1)
        resolves[0]()


        await new Promise(resolve => setTimeout(resolve, 0))
        expect(latest.value).toEqual(['init', 'second', 'third'])
    })

    it('should ignore incoming values when a resolve is in progress', async () => {
        let resolves = [] as Function[]
        const input = $.primitive.create('init')
        const latest = $.primitive.connect(
            input.listen,
            $.await.block(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x)))),
            ),
            $.type.isError($.stop()),
        )


        input.value = 'second'
        input.value = 'third'

        // not yet finished
        expect(latest.value).toBe(undefined)

        // only one promise has been created
        expect(resolves.length).toBe(1)

        // now resolve
        resolves[0]()

        await new Promise(resolve => setTimeout(resolve, 0))

        // only the first value has made it through
        expect(latest.value).toEqual('init')
    })

    it('should debounce', async () => {
        const input = $.primitive.create('init')
        const debounced = $.primitive.connect(
            input.listen,
            $.debounce(100),
        )

        input.value = 'second'
        input.value = 'third'

        await new Promise(resolve => setTimeout(resolve, 50))

        // not yet finished
        expect(debounced.value).toBe(undefined)

        await new Promise(resolve => setTimeout(resolve, 150))

        // only the last value has made it through
        expect(debounced.value).toEqual('third')
    })
})