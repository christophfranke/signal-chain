import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'


describe('if', () => {
    it('should fallback to empty array if input is too short', async () => {
        const fetchmock = (_: string) => Promise.resolve({
            json: () => Promise.resolve(['So', 'many', 'suggestions'])
        })

        // store user input into a reactive primitive
        const input = $.primitive.create('')

        // utility function we will use for debounce
        // resolves the promise to the input after the given time
        const wait = <T>(input: T, ms: number) => new Promise<T>(resolve => setTimeout(() => resolve(input), ms))

        $.connect(
            input.listen,

            // debounce
            $.await.latest(
                $.select(input => wait(input, 150)),
            ),
            $.type.not.isError(),

            // ensure long enough input, if not, fallback to empty array
            $.if(
                input => input.length > 2,
                $.chain(
                    $.select(input => `/api/suggest/${input}`),
                    $.await.latest(
                        $.select(url => fetchmock(url).then(response => response.json()) as Promise<string[]>),
                    ),
                    $.type.isError(
                        $.effect(err => console.error('Error fetching suggestions:', err)),
                        $.select(() => []),
                    ),
                ),
                $.emit([])
            ),

            $.log('Suggestions:') // Suggestions: ['So', 'many', 'suggestions', ...]
        )

        expect(true).toBe(true)
    })

    it('should not fail on the readme example', () => {
        const appleFormat = $.chain(
           $.select<number>(x => Math.round(x)),
           $.if(
                x => x > 1,
                $.select(x => `We have ${x} apples`),
                $.if(
                    x => x === 1,
                    $.select(() => `We have an apple`),
                    $.if(
                        x => x === 0,
                        $.select(() => `We have no apples`),
                        $.chain(
                            $.effect(x => console.error(`Cannot have ${x} apples. No update to appleFormat.`)),
                            $.stop()
                        )
                    ),
                ),
           ),
        )

        expect($.evaluate($.emit(1), appleFormat)).toBe('We have an apple')
    })
})
