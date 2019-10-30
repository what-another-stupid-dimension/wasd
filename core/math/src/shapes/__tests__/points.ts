import Point from '../point'
import Type from '../type'

test('geometry > point > type', () => {
  const point = new Point()
  expect(point.type).toBe(Type.Point)
})

test('geometry > circle > isPoint', () => {
  const point = new Point()
  expect(Point.isPoint(point)).toBeTruthy()
})
