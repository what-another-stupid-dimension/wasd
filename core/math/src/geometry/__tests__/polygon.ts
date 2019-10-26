import Polygon from '../polygon'
import { ShapeType } from '../shape'
import Vector from '../vector'

const verticesFixture: Vector[] = [
  new Vector(-10, -10),
  new Vector(-20, -20),
  new Vector(20, -20),
  new Vector(20, -10),
  new Vector(0, 0)
]

test('geometry > polygon > getter', () => {
  const polygon = new Polygon(verticesFixture)
  expect(polygon.points).toStrictEqual(verticesFixture)
})

test('geometry > polygon > setter', () => {
  const polygon = new Polygon(verticesFixture)
  const updatedVertices = verticesFixture.concat([new Vector(10, 10)])
  polygon.points = updatedVertices
  expect(polygon.points).toStrictEqual(updatedVertices)
})

test('geometry > polygon > type', () => {
  const polygon = new Polygon(verticesFixture)
  expect(polygon.type).toBe(ShapeType.Polygon)
})

test('geometry > polygon > isPolygon', () => {
  const polygon = new Polygon(verticesFixture)
  expect(Polygon.isPolygon(polygon)).toBeTruthy()
})
