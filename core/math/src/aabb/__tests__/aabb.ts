import aabb from '../aabb'
import { Vector, Rectangle } from '../../geometry'

test('aabbb > to detect same position collisions', () => {
  const rectangle1 = new Rectangle(30, 30)
  const rectangle2 = new Rectangle(30, 30)
  expect(
    aabb(new Vector(0, 0), rectangle1, new Vector(0, 0), rectangle2)
  ).toBeTruthy()
})

test('aabbb > to detect overlapping collisions', () => {
  const rectangle1 = new Rectangle(30, 30)
  const rectangle2 = new Rectangle(30, 30)
  expect(
    aabb(new Vector(0, 0), rectangle1, new Vector(10, 10), rectangle2)
  ).toBeTruthy()
})

test('aabbb > to detect non collisions', () => {
  const rectangle1 = new Rectangle(30, 30)
  const rectangle2 = new Rectangle(30, 30)
  expect(
    aabb(new Vector(30, 0), rectangle1, new Vector(0, 0), rectangle2)
  ).toBeFalsy()
})
