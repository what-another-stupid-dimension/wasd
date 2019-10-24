import getHelloPhrase from '../index'

test('sample say hello test', () => {
  expect(getHelloPhrase('Alex')).toStrictEqual({ string: 'Hello Alex!' })
})
