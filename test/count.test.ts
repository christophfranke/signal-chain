import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('counter', () => {
    it('should count the emitted values correctly', async () => {
        let emitter = $.primitive.create(0, { update: 'immediate', batch: false })

        const count = $.primitive.connect(
            emitter.listen,
            // $.log('emitter'),
            $.passIf(x => x % 2 === 0),
            $.chain(
                $.count(),
                $.select(x => -x),
            ),
            $.count(),
            // $.log('count'),
        )

        expect(count.value).toBe(1)

        emitter.value = 1
        emitter.value = 2
        emitter.value = 3
        emitter.value = 4
        emitter.value = 5

        // set 5 times, value updates immediately
        expect(emitter.value).toBe(5)

        // count is 3, because it has been triggered with 0, 2, and 4
        expect(count.value).toBe(3)

        emitter.value = 11

        // emitter is not even, so still 3
        expect(count.value).toBe(3)

        emitter.value = 10

        // emiiter is even, no it's 4
        expect(count.value).toBe(4)
    })
})