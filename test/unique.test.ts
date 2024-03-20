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
})



