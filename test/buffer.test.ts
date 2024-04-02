import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('buffer', () => {
    it('should fill the buffer and then fire', async () => {
        let emitter = $.primitive.create(1, { update: 'sync' })

        const buffered = $.primitive.connect(
            emitter.listen,
            // $.log('before buffered'),
            $.buffer(3),
            // $.log('after buffered')
        )

        // no value arrived yet
        expect(buffered.value).toBe(undefined)

        emitter.value = 2
        emitter.value = 3

        // buffer fires when it's full
        expect(buffered.value).toEqual([1, 2, 3])

        emitter.value = 4
        emitter.value = 5

        // buffer not yet fired again
        expect(buffered.value).toEqual([1, 2, 3])

        emitter.value = 6

        // now it has
        expect(buffered.value).toEqual([4, 5, 6])
    })
})