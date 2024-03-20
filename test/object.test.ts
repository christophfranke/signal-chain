import $ from '../src/signal-ts'
import { describe, it, expect } from 'vitest'


describe('reactive objects', () => {
    it('can listen to objects and arrays', async () => {
        const data = {
            a: [1, 2, 3],
            b: {
                hello: 'world',
                array: ['I', 'am', 'an', 'array']
            }
        }

        let aCounter = 0
        let a: number[] = []
        let bArray: string[] = []
        let hello: string = ''

        $.connect(
            $.emit(data),
            $.combine(
                $.chain(
                    $.listen.key('a'),
                    $.log('a'),
                    $.effect(x => { a = [...x] }),
                    $.each(
                        $.effect(() => { aCounter++ })
                    )
                ),
                $.chain(
                    $.listen.key('b'),
                    $.log('b'),
                    $.combine(
                        $.chain(
                            $.listen.key('array'),
                            $.effect(x => { bArray = [...x] })
                        ),
                        $.chain(
                            $.listen.key('hello'),
                            $.effect(x => { hello = x })
                        )
                    )
                )
            ),
        )

        expect(a).toEqual([1, 2, 3])
        expect(aCounter).toBe(3)
        expect(bArray).toEqual(['I', 'am', 'an', 'array'])
        expect(hello).toEqual('world')

        data.a.push(4)
        await Promise.resolve()

        expect(a).toEqual([1, 2, 3, 4])
        expect(aCounter).toBe(7)

        data.b = {
            hello: 'me',
            array: ['I', 'am', 'an', 'array', 'too']
        }

        data.b.array.push('!')

        await Promise.resolve()
        expect(hello).toEqual('me')
        expect(bArray).toEqual(['I', 'am', 'an', 'array', 'too', '!'])
    })
})

