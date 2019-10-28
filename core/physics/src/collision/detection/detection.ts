import { Polygon, sat, Shape, ShapeType, Vector } from '@wasd/math'

export const polygonPolygon = (
  position1: Vector,
  polygon1: Polygon,
  position2: Vector,
  polygon2: Polygon
): boolean => {
  return sat(position1, polygon1, position2, polygon2)
}

export const responePolygonPolygon = (): void => {}

export default (
  position1: Vector,
  shape1: Shape,
  position2: Vector,
  shape2: Shape
): boolean => {
  if (shape1.type === ShapeType.Polygon && shape2.type === ShapeType.Polygon) {
    return polygonPolygon(
      position1,
      shape1 as Polygon,
      position2,
      shape2 as Polygon
    )
  }

  return false
}
