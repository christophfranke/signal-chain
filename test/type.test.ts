import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

async function maybeFail<T>(x: T): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (Math.random() < 0.25) {
        throw new Error('Random error')
    }

    return x
}

describe('type', () => {
    it('should assert that something is or is not a number', () => {
        let ok = false

        $.connect(
            $.emit(Math.random() > 0.5 ? 'hi' : 1),
            $.type.isNumber(
                $.effect(() => { ok = true }),
                $.stop()
            ),
            $.select(() => 'I am not a number'),
            // $.log('hallo'),
            $.type.not.isNumber(
                $.effect(() => { ok = true }),
            ),
            $.select()
        )

        expect(ok).toBe(true)
    })

    it('should not crash', () => {
        const isString = (x: any): x is string => typeof x === 'string'
        $.connect(
            $.select(x => x ? `${x}` : undefined),
            $.type.isNothing(
                $.select(x => x),
                $.select(() => null)
            ),
            $.effect(x => expect(x).toBe(null)),
            $.catch(
                $.select(x => x!.split('').join('')),
                // the test should always pass, but it is relevant for typescript anyway
                $.select(x => Math.random() > 0.75 ? x : x.length),
                $.type.is(isString, 'Value must be a string')(),
                $.select(s => s.length),
            ),
            // $.type.not.isError(),
            $.await.latest($.select(maybeFail)),
            $.type.isError(
                $.select(error => `Error: ${error.message}`)
            ),
        )
    })
})