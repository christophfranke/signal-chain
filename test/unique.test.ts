import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('pass if changed', () => {
    it('should only pass if the value has changed', async () => {
        const input = $.primitive.create('init')
        const changed = $.primitive.connect(
            input.listen,
            $.passUnique(),
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
            $.uniqueValue(
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
            $.uniqueValue(
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
})



