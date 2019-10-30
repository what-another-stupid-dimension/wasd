import Rectangle from '../rectangle'
import Type from '../type'

test('geometry > rectangle > getter', () => {
  const rectangle = new Rectangle(10, 20)
  expect(rectangle.width).toBe(10)
  expect(rectangle.height).toBe(20)
})

test('geometry > rectangle > setter', () => {
  const rectangle = new Rectangle(0, 0)
  rectangle.width = 30
  rectangle.height = 40
  expect(rectangle.width).toBe(30)
  expect(rectangle.height).toBe(40)
})

test('geometry > rectangle > type', () => {
  const rectangle = new Rectangle(0, 0)
  expect(rectangle.type).toBe(Type.Rectangle)
})

test('geometry > rectangle > isRectangle', () => {
  const rectangle = new Rectangle(0, 0)
  expect(Rectangle.isRectangle(rectangle)).toBeTruthy()
})
