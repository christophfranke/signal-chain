import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('unique', () => {
    it('should only pass if the value has changed', async () => {
        const input = $.primitive.create('init')
        const changed = $.primitive.connect(
            input.listen,
            $.unique.pass(),
            $.count()
        )

        // initial connect
        expect(changed.value).toBe(1)

        input.value = '1'
        await Promise.resolve()

        // value has changed
        expect(changed.value).toBe(2)

        input.value = '1'
        await Promise.resolve()

        // value has not changed
        expect(changed.value).toBe(2)

        input.value = '2'
        input.value = '3'

        await Promise.resolve()
        expect(changed.value).toBe(3)
    })

    it('should wrap the unique chain', () => {
        const someNumber = $.primitive.create(1, { update: 'sync' })

        const changes = $.primitive.connect(
            $.unique.chain(
                someNumber.listen,
                $.select(x => Math.round(x))
            ),
            $.count()
        )

        expect(changes.value).toBe(1)

        someNumber.value = 1.1
        expect(changes.value).toBe(1)

        someNumber.value = 1.9
        expect(changes.value).toBe(2)

        someNumber.value = 2.1
        expect(changes.value).toBe(2)
    })

    it('should not cleanup effects later in chain', () => {
        const someNumber = $.primitive.create(1, { update: 'sync' })

        let destroyed = 0
        const changes = $.primitive.connect(
            $.unique.chain(
                someNumber.listen,
                $.select(x => Math.round(x))
            ),
            $.effect(() => {
                return () => {
                    destroyed++
                }
            })
        )

        expect(destroyed).toBe(0)

        someNumber.value = 1.1
        expect(destroyed).toBe(0)

        someNumber.value = 1.9
        expect(destroyed).toBe(1)

        changes.disconnect()
        expect(destroyed).toBe(2)
    })

    it('should always fire when receiving a new value', () => {
        const someNumber = $.primitive.create(1, { update: 'sync' })
        const changes = $.primitive.connect(
            someNumber.listen,
            $.unique.chain(
                $.select(x => Math.round(x))
            ),
            $.count()
        )

        expect(changes.value).toBe(1)

        someNumber.value = 1.1
        expect(changes.value).toBe(2)

        someNumber.value = 1
        expect(changes.value).toBe(3)
    })

    it('should pass and cleanup properly for unique.select', () => {
        const someNumber = $.primitive.create(1, { update: 'sync' })
        let effect = 0
        let cleanup = 0
        let final = false

        const disconnect = $.connect(
            someNumber.listen,
            $.unique.select(x => Math.round(x)),
            $.effect(() => {
                effect++
                return (f) => {
                    cleanup++
                    final = f ?? false
                }
            })
        )

        expect(cleanup).toBe(0)
        expect(effect).toBe(1)
        expect(final).toBe(false)

        someNumber.value = 1.1
        expect(cleanup).toBe(0)
        expect(effect).toBe(1)
        expect(final).toBe(false)

        someNumber.value = 1.9
        expect(cleanup).toBe(1)
        expect(effect).toBe(2)
        expect(final).toBe(false)

        disconnect()
        expect(cleanup).toBe(2)
        expect(effect).toBe(2)
        expect(final).toBe(true)
    })

    it('should pass and cleanup properly for unique.chain', () => {
        const someNumber = $.primitive.create(1, { update: 'sync' })
        let effect = 0
        let cleanup = 0
        let final = false

        const disconnect = $.connect(
            $.unique.chain(
                someNumber.listen,
                $.select(x => Math.round(x)),
            ),
            $.effect(() => {
                effect++
                return (f) => {
                    cleanup++
                    final = f ?? false
                }
            })
        )

        expect(cleanup).toBe(0)
        expect(effect).toBe(1)
        expect(final).toBe(false)

        someNumber.value = 1.1
        expect(cleanup).toBe(0)
        expect(effect).toBe(1)
        expect(final).toBe(false)

        someNumber.value = 1.9
        expect(cleanup).toBe(1)
        expect(effect).toBe(2)
        expect(final).toBe(false)

        disconnect()
        expect(cleanup).toBe(2)
        expect(effect).toBe(2)
        expect(final).toBe(true)
    })

    it('should pass and cleanup properly for unique.pass', () => {
        const someNumber = $.primitive.create(1, { update: 'sync' })
        let effect = 0
        let cleanup = 0
        let final = false

        const disconnect = $.connect(
            someNumber.listen,
            $.select(x => Math.round(x)),
            $.unique.pass(),
            $.effect(() => {
                effect++
                return (f) => {
                    cleanup++
                    final = f ?? false
                }
            })
        )

        expect(cleanup).toBe(0)
        expect(effect).toBe(1)
        expect(final).toBe(false)

        someNumber.value = 1.1
        expect(cleanup).toBe(0)
        expect(effect).toBe(1)
        expect(final).toBe(false)

        someNumber.value = 1.9
        expect(cleanup).toBe(1)
        expect(effect).toBe(2)
        expect(final).toBe(false)

        disconnect()
        expect(cleanup).toBe(2)
        expect(effect).toBe(2)
        expect(final).toBe(true)
    })
})



