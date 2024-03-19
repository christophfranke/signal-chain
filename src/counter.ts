import $ from './signal-ts'
import { Chain } from './signal/types'


const render = (element: HTMLElement, chain: Chain<void, string>) => {
    return $.connect(
        chain,
        $.effect(value => {
            element.innerHTML = value
        })
    )
}

export function setupCounter(element: HTMLButtonElement) {
    const counter = $.primitive.create(0)
    const text = $.chain(
        counter.listen,
        $.select(count => `Count is ${count}`)
    )

    render(element, text)

    $.connect(
        $.emit(element),
        $.listen.event('click'),
        $.effect(() => {
            counter.update(counter.value + 1)
        })
    )
}

