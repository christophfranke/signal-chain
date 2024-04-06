import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'


describe('combine', () => {
    it('should combine two signals', () => {
        const a = $.primitive.create(1, { update: 'sync' })
        const b = $.primitive.create(2, { update: 'sync' })

        const combined = $.primitive.connect(
            $.combine(a.listen, b.listen),
            $.select(([a, b]) => a + b)
        )

        expect(combined.value).toBe(3)

        a.value = 2
        expect(combined.value).toBe(4)

        b.value = 3
        expect(combined.value).toBe(5)
    })

    it('should cleanup effects', () => {
        const a = $.primitive.create(1, { update: 'sync' })
        const b = $.primitive.create(2, { update: 'sync' })

        let effect = 0
        let cleanup = 0
        let final = false

        const combined = $.primitive.connect(
            $.combine(a.listen, b.listen),
            $.select(([a, b]) => a + b),
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
        expect(combined.value).toBe(3)

        a.value = 2

        expect(combined.value).toBe(4)
        expect(effect).toBe(2)
        expect(cleanup).toBe(1)
        expect(final).toBe(false)

        b.value = 3

        expect(cleanup).toBe(2)
        expect(effect).toBe(3)
        expect(final).toBe(false)
        expect(combined.value).toBe(5)

        combined.disconnect()

        expect(cleanup).toBe(3)
        expect(effect).toBe(3)
        expect(final).toBe(true)
        expect(combined.value).toBe(5)
    })
})