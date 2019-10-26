import Point from '../point'
import { ShapeType } from '../shape'

test('geometry > point > type', () => {
  const point = new Point()
  expect(point.type).toBe(ShapeType.Point)
})

test('geometry > circle > isPoint', () => {
  const point = new Point()
  expect(Point.isPoint(point)).toBeTruthy()
})
