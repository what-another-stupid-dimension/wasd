import Circle from '../circle'
import { ShapeType } from '../shape'

test('geometry > circle > getter', () => {
  const circle = new Circle(30)
  expect(circle.radius).toBe(30)
})

test('geometry > circle > setter', () => {
  const circle = new Circle(0)
  circle.radius = 30
  expect(circle.radius).toBe(30)
})

test('geometry > circle > type', () => {
  const circle = new Circle(0)
  expect(circle.type).toBe(ShapeType.Circle)
})

test('geometry > circle > isCircle', () => {
  const circle = new Circle(0)
  expect(Circle.isCircle(circle)).toBeTruthy()
})
