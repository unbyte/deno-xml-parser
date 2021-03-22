import { ReflectedTypes } from './xml.ts'

export function reflectValue(value: string): ReflectedTypes {
  switch (value) {
    // bool
    case 'true':
      return true
    case 'false':
      return false
    default:
      if (value !== '') {
        // number
        const number = Number(value)
        if (!Number.isNaN(number)) return number
      }
      // string
      return value
  }
}

export function removeNamespace(tag: string) {
  const tags = tag.split(':')
  if (tags[0] === 'xmlns') return ''
  if (tags.length > 1) return tags[1]
  return tag
}

export interface Pair {
  key: string | Symbol
  value: any
}

export function objToPairArray(obj: any): Pair[] {
  return Object.getOwnPropertyNames(obj).map(key => ({ key, value: obj[key] }))
}

export function assert(test: boolean, msg: string = '') {
  if (!test) throw new Error(msg)
}
