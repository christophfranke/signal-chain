const flatten = <T>(array: any[]): T[] => {
  const result = array.flat()
  return result.some(value => Array.isArray(value)) ? flatten(result) : result
}

const isFunction = (something: any): something is Function => typeof something === 'function'

export const execute = (something: unknown, ...arg: unknown[]): unknown => {
  if (!something) {
    return null
  }

  if (isFunction(something)) {
    return something(...arg)
  }

  if (Array.isArray(something)) {
    return flatten<Function>(something)
      .filter(isFunction)
      .map(fn => fn(...arg))
  }

  console.warn('unable to execute', something)
  // throw new Error('unable to execute')
}

