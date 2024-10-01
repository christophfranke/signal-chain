import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'


describe('error', () => {
    it('discard an error and make it undefined instead', () => {
        const fail = (mark: string) => () => expect(0).toBe(mark)

        $.connect(
            $.catch(
                $.emit(100),
                $.error.handle(
                    // handle should not be executed
                    $.effect(fail('handle'))
                ),
                $.select(() => { if (Math.random() < 1) throw new Error('Some Error'); else return 100 }),
                $.effect(fail('after error')),
            ),
            $.error.discard(),
            $.effect(x => expect(x).toBe(undefined))
        )
    })

    it('handles an error', () => {
        let handled = false

        $.connect(
            $.emit(new Error('Handle this please')),
            $.error.handle(
                $.effect(() => { handled = true }),
                $.emit(100),
            ),
        )

        expect(handled).toBe(true)
    })

    it('panics on error', () => {
        const result = $.primitive.connect(
            $.emit(1),
            $.error.panik(),
            $.catch(
                $.emit(new Error('Handle this please')),
                $.error.panik(),
                $.emit(100),
            ),
        )

        expect(result.value instanceof Error).toBe(true)
        expect(result.value.toString()).toBe('Error: Handle this please')
    })
})