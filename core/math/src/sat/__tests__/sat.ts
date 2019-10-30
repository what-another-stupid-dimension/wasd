import sat from '../sat'
import { Polygon } from '../../shapes'
import Vector from '../../vector'

test('sat > detects collision', () => {
  const position1 = new Vector(0, 0)
  const polygon1 = new Polygon([
    new Vector(0, 2),
    new Vector(2, 0),
    new Vector(4, 1),
    new Vector(3, 3),
    new Vector(1, 4)
  ])
  const position2 = new Vector(0, 0)
  const polygon2 = new Polygon([
    new Vector(2, 2),
    new Vector(4, 2),
    new Vector(5, 5),
    new Vector(2, 6),
    new Vector(0, 4)
  ])

  expect(sat(position1, polygon1, position2, polygon2)).toBeTruthy()
})

test('sat > detects non collision', () => {
  const position1 = new Vector(1, 0)
  const polygon1 = new Polygon([
    new Vector(0, 2),
    new Vector(2, 0),
    new Vector(4, 1),
    new Vector(3, 3),
    new Vector(1, 4)
  ])
  const position2 = new Vector(4, 0)
  const polygon2 = new Polygon([
    new Vector(2, 2),
    new Vector(4, 2),
    new Vector(5, 5),
    new Vector(2, 6),
    new Vector(0, 4)
  ])

  expect(sat(position1, polygon1, position2, polygon2)).toBeFalsy()
})
