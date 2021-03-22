import {
  assert,
  objToPairArray,
  reflectValue,
  removeNamespace,
} from './utils.ts'

Deno.test('reflect value', () => {
  const testCases = [
    { input: 'true', expect: true },
    { input: 'false', expect: false },
    { input: '', expect: '' },
    { input: 'aa', expect: 'aa' },
    { input: '1', expect: 1 },
    { input: '0x001', expect: 1 },
  ]
  for (const test of testCases) {
    assert(reflectValue(test.input) === test.expect)
  }
})

Deno.test('remove namespace', () => {
  const testCases = [
    { input: 'a:ab', expect: 'ab' },
    { input: 'ab', expect: 'ab' },
    { input: 'xmlns:a', expect: '' },
  ]
  for (const test of testCases) {
    assert(removeNamespace(test.input) === test.expect)
  }
})

Deno.test('obj to pair array', () => {
  const objA = {
    a: 1,
  }
  const pairsA = objToPairArray(objA)
  assert(pairsA.length === 1)
  assert(pairsA[0].key === 'a')
  assert(pairsA[0].value === 1)

  class B {
  }
  ;(B as any).a = 1
  const objB = new B()
  const pairsB = objToPairArray(objB)
  assert(pairsB.length === 0)
})
