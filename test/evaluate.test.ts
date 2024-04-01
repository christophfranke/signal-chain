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

    it('should evaluate synchronously', () => {
        expect($.evaluate(syncChain)).toBe(1)
    })

    it('should return an error when synchronously evaluating an async chain', () => {
        expect($.evaluate(asyncChain)).toBeInstanceOf(Error)
    })

    it('should return an error when synchronously evaluating a incomplete chain', () => {
        expect($.evaluate(incompleteChain)).toBeInstanceOf(Error)
    })

    it('should evaluate synchonously', async () => {
        const result = $.evaluate(syncChain)
        expect(result).toBe(1)
    })

    it('should evaluate asynchrounously', async () => {
        const result = await $.evaluate(asyncChain)
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
})

