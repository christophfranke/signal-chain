import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('counter', () => {
    it('should count the emitted values correctly', async () => {
        let emitter = $.primitive.create(0)

        const count = $.primitive.connect(
            emitter.listen,
            // $.log('emitter'),
            $.passIf(x => x % 2 === 0),
            $.chain(
                $.count(),
                $.select(x => -x),
            ),
            $.sidechain(
                $.count(),
            ),
            $.select(([x, y]) => -x * y),
            // $.log('count'),
        )

        emitter.value = 1
        emitter.value = 2
        emitter.value = 3
        emitter.value = 4
        emitter.value = 5

        // set 5 times, value updates immediately
        expect(emitter.value).toBe(5)

        // when next microtask is available, expect it to update once
        await Promise.resolve()
        expect(count.value).toBe(1)

        emitter.value = 11
        await Promise.resolve()

        // count has not changed, passIf is blocking completion of the chain
        expect(count.value).toBe(1)

        emitter.value = 10
        await Promise.resolve()
        expect(count.value).toBe(4) // 2 squared
    })
})