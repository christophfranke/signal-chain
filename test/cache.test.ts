import $ from '../src/signal-ts'
import { describe, it } from 'vitest'

describe('cache', () => {
    it('should cache items', async () => {
        const myCache = $.cache.create<number, Promise<string>>({
            key: n => `${n}`,
            // isValid: () => true,
        })
        // const cache = $.cache.create()
        const input = $.primitive.create(0, { update: 'sync' })

        $.connect(
            input.listen,
            $.log('input'),
            myCache.$.hit(
                $.chain(
                    $.await.parallel(
                        $.select<Promise<string>>(),
                        $.log('hit'),
                    ),
                    $.error.stop(),
                    $.select(x => Math.sqrt(parseInt(x))),
                    $.log('from cache hit'),
                )
            ),
            $.await.latest(
                myCache.$.use(
                    $.chain(
                        $.select(n => n % 2 === 0 ? Promise.resolve(n*n) : Promise.reject()),
                        $.log('add to cache'),
                        $.then(n => `${n}`),
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

        console.log(myCache.data)
    })
})