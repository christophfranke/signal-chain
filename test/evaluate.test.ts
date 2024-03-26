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
        )
    )

    const incompleteChain = $.chain(
        $.stop()
    )

    it('should evaluate synchronously', () => {
        expect($.evaluate.sync(syncChain)).toBe(1)
    })

    it('should return an error when synchronously evaluating an async chain', () => {
        expect($.evaluate.sync(asyncChain)).toBeInstanceOf(Error)
    })

    it('should return an error when synchronously evaluating a incomplete chain', () => {
        expect($.evaluate.sync(incompleteChain)).toBeInstanceOf(Error)
    })

    it('should evaluate synchonously', async () => {
        const result = await $.evaluate.async(syncChain)
        expect(result).toBe(1)
    })

    it('should evaluate asynchrounously', async () => {
        const result = await $.evaluate.async(asyncChain)
        expect(result).toBe(1)
    })
})