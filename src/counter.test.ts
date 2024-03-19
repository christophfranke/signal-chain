import $ from './signal-ts'
import { describe, it, expect } from 'vitest'

describe('Counter application', () => {
  it('initializes with a count of 0', () => {
    const counter = $.primitive.create(0)
    expect(counter.value).toBe(0)
  })

  it('updates the count on event', () => {
    const counter = $.primitive.create(0)
    counter.update(counter.value + 1)
    expect(counter.value).toBe(1)
  })

  it('formats the count display correctly', () => {
    const counter = $.primitive.create(5) // Setting initial count to 5 for this test
    const text = $.primitive.connect(
      counter.listen,
      $.select(count => `Count is ${count}`)
    )

    expect(text.value).toBe('Count is 5')
  })
})
