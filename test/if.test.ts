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
            $.assert.not.isError(),

            // ensure long enough input, if not, fallback to empty array
            $.if((input: string)  => input.length > 2, [])(
                $.select(input => `/api/suggest/${input}`),
                $.await.latest(
                    $.select(url => fetchmock(url).then(response => response.json()) as Promise<string[]>),
                ),
                $.assert.isError(
                    $.effect(err => console.error('Error fetching suggestions:', err)),
                    $.select(() => []),
                ),
            ),

            $.log('Suggestions:') // Suggestions: ['So', 'many', 'suggestions', ...]
        )

        expect(true).toBe(true)
    })
})
