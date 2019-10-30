import { sat, Vector, shapes } from '@wasd/math'

export const polygonPolygon = (
  position1: Vector,
  polygon1: shapes.Polygon,
  position2: Vector,
  polygon2: shapes.Polygon
): boolean => {
  return sat(position1, polygon1, position2, polygon2)
}

export const responePolygonPolygon = (): void => {}

export default (
  position1: Vector,
  shape1: shapes.Shape,
  position2: Vector,
  shape2: shapes.Shape
): boolean => {
  if (
    shape1.type === shapes.Type.Polygon &&
    shape2.type === shapes.Type.Polygon
  ) {
    return polygonPolygon(
      position1,
      shape1 as shapes.Polygon,
      position2,
      shape2 as shapes.Polygon
    )
  }

  return false
}
