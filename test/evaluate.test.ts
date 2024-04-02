import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'

describe('evaluate', () => {
    const syncChain = $.chain(
        $.emit(1),
    )

    const asyncChain = $.chain(
        $.emit(1),
        $.await.latest(
            $.select(x => Promise.resolve(x))
        ),
        $.type.not.isError()
    )

    const incompleteChain = $.chain(
        $.stop()
    )

    const asyncWeakChain = $.chain(
        $.await.latest(
            $.stop()
        )
    )

    it('should evaluate synchronously', () => {
        expect($.evaluate(syncChain)).toBe(1)
    })

    it('evaluate the async chain', async () => {
        expect(await $.evaluate(asyncChain)).toBe(1)
    })

    it('should return undefined when incomplete', () => {
        expect($.evaluate(incompleteChain)).toBe(undefined)
    })

    it('should evaluate undefined on async weak', async () => {
        expect(await $.evaluate(asyncWeakChain)).toBe(undefined)
    })

    it('should evaluate synchonously', async () => {
        const result = $.evaluate(syncChain)
        expect(result).toBe(1)
    })

    it('should create a synchronous function from a chain', () => {
        const fn = $.function(
            $.select<number>(x => x + 1)
        )
        expect(fn(0)).toBe(1)
    })

    it('should create an asynchronous function from a chain', async () => {
        const fn = $.function(
            $.select<number>(),
            $.await.latest(
                $.select(x => Promise.resolve(x + 1))
            ),
            $.type.not.isError()
        )

        const result = await fn(0)
        expect(result).toBe(1)
    })

    it('should create a function that may or may not evaluate', () => {
        const fn = $.function(
            $.select<number>(),
            $.passIf(x => x > 0)
        )

        expect(fn(0)).toBe(undefined)
        expect(fn(1)).toBe(1)
    })
})

