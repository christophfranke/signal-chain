import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'


describe('async', () => {
    it('should only resolve the latest value', async () => {
        const resolves = [] as Function[]
        const input = $.primitive.create('init')
        const latest = $.primitive.connect(
            input.listen,
            $.await.latest(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.assert.isError($.stop()),
        )


        input.update('second')
        input.update('third')

        await Promise.resolve()

        // not yet finished
        expect(latest.value).toBe(undefined)

        resolves.reverse()
        resolves.forEach(resolve => resolve())

        await Promise.resolve()

        // all but the latest value have been discarded
        expect(latest.value).toBe('third')
    })

    it('should resolve all values when resolved', async () => {
        const resolves = [] as Function[]
        const input = $.primitive.create('init')
        const latest = $.primitive.connect(
            input.listen,
            // $.log('input'),
            $.await.parallel(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.assert.isError($.stop()),
            // $.log('parallel')
        )


        input.update('second')
        input.update('third')

        await Promise.resolve()

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
        const input = $.primitive.create('init')
        const latest = $.primitive.connect(
            input.listen,
            $.await.order(
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.assert.isError($.stop()),
            // $.log('order'),
            $.collect(),
            // $.log('collected')
        )


        input.update('second')
        input.update('third')

        await Promise.resolve()

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
        const input = $.primitive.create('init')
        const latest = $.primitive.connect(
            input.listen,
            $.await.queue(
                $.select(x => new Promise<string>(resolve => {
                    const fn = () => {
                        resolve(x)
                        resolves = resolves.filter(r => r !== fn)
                    }
                    resolves.push(fn)
                }))
            ),
            $.assert.isError($.stop()),
            $.collect()
        )


        input.update('second')
        input.update('third')

        await Promise.resolve()

        // not yet finished
        expect(latest.value).toBe(undefined)
        expect(resolves.length).toBe(1)

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
                $.select(x => new Promise<string>(resolve => resolves.push(() => resolve(x))))
            ),
            $.assert.isError($.stop()),
        )


        input.update('second')
        input.update('third')

        await Promise.resolve()

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
})