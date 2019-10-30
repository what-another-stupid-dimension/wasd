import { Vector, shapes } from '@wasd/math'
import detection from '../detection'

test('collision > detection > polygon to polygon > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ]),
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(2, 2),
        new Vector(4, 2),
        new Vector(5, 5),
        new Vector(2, 6),
        new Vector(0, 4)
      ])
    )
  ).toBeTruthy()
})

test('collision > detection > polygon to polygon > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ]),
      new Vector(5, 0),
      new shapes.Polygon([
        new Vector(2, 2),
        new Vector(4, 2),
        new Vector(5, 5),
        new Vector(2, 6),
        new Vector(0, 4)
      ])
    )
  ).toBeFalsy()
})

test('collision > detection > polygon to circle > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ]),
      new Vector(0, 0),
      new shapes.Circle(20)
    )
  ).toBeTruthy()
})

test('collision > detection > polygon to circle > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ]),
      new Vector(15, 0),
      new shapes.Circle(20)
    )
  ).toBeFalsy()
})

test('collision > detection > polygon to rectangle > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ]),
      new Vector(0, 0),
      new shapes.Rectangle(20, 20)
    )
  ).toBeTruthy()
})

test('collision > detection > polygon to rectangle > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ]),
      new Vector(5, 0),
      new shapes.Rectangle(20, 20)
    )
  ).toBeFalsy()
})

test('collision > detection > circle to polygon > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Circle(20),
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ])
    )
  ).toBeTruthy()
})

test('collision > detection > circle to polygon > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Circle(20),
      new Vector(10, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ])
    )
  ).toBeFalsy()
})

test('collision > detection > circle to circle > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Circle(20),
      new Vector(0, 0),
      new shapes.Circle(20)
    )
  ).toBeTruthy()
})

test('collision > detection > circle to circle > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Circle(20),
      new Vector(20, 0),
      new shapes.Circle(20)
    )
  ).toBeFalsy()
})

test('collision > detection > circle to rectangle > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Circle(20),
      new Vector(0, 0),
      new shapes.Rectangle(20, 20)
    )
  ).toBeTruthy()
})

test('collision > detection > circle to rectangle > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Circle(20),
      new Vector(20, 0),
      new shapes.Rectangle(20, 20)
    )
  ).toBeFalsy()
})

test('collision > detection > rectangle to polygon > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Rectangle(20, 20),
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ])
    )
  ).toBeTruthy()
})

test('collision > detection > rectangle to polygon > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Rectangle(20, 20),
      new Vector(20, 0),
      new shapes.Polygon([
        new Vector(0, 2),
        new Vector(2, 0),
        new Vector(4, 1),
        new Vector(3, 3),
        new Vector(1, 4)
      ])
    )
  ).toBeFalsy()
})

test('collision > detection > rectangle to circle > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Rectangle(20, 20),
      new Vector(0, 0),
      new shapes.Circle(20)
    )
  ).toBeTruthy()
})

test('collision > detection > rectangle to circle > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Rectangle(20, 20),
      new Vector(30, 0),
      new shapes.Circle(20)
    )
  ).toBeFalsy()
})

test('collision > detection > rectangle to rectangle > detects collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Rectangle(20, 20),
      new Vector(0, 0),
      new shapes.Rectangle(20, 20)
    )
  ).toBeTruthy()
})

test('collision > detection > rectangle to rectangle > detects non collision', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Rectangle(20, 20),
      new Vector(20, 0),
      new shapes.Rectangle(20, 20)
    )
  ).toBeFalsy()
})

test('collision > detection > point to * > never collides', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Point(),
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(2, 2),
        new Vector(4, 2),
        new Vector(5, 5),
        new Vector(2, 6),
        new Vector(0, 4)
      ])
    )
  ).toBeFalsy()
})

test('collision > detection > * to point > never collides', () => {
  expect(
    detection(
      new Vector(0, 0),
      new shapes.Polygon([
        new Vector(2, 2),
        new Vector(4, 2),
        new Vector(5, 5),
        new Vector(2, 6),
        new Vector(0, 4)
      ]),
      new Vector(0, 0),
      new shapes.Point()
    )
  ).toBeFalsy()
})
