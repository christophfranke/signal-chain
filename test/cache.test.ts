import $ from '../src/signal-ts'
import { describe, it } from 'vitest'

describe('cache', () => {
    it('should cache items', async () => {
        const cache = $.cache.create({
            key: (n: number) => `${n}`,
        })
        const input = $.primitive.create(0, { update: 'sync' })

        $.connect(
            input.listen,
            $.log('input'),
            $.await.latest(
                cache.use(
                    $.chain(
                        $.select(n => n % 2 === 0 ? Promise.resolve(n*n) : Promise.reject()),
                        $.log('add to cache'),
                    ),
                )
            ),
            $.error.discard(),
            $.log('result'),
        )

        input.value = 1
        input.value = 0
        input.value = 2
        input.value = 1
        input.value = 0

        await Promise.resolve()
        input.value = 2
        await Promise.resolve()

        console.log(cache.data)
    })
})