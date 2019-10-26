import { Polygon, Vector } from '../geometry'

export default (
  position1: Vector,
  polygon1: Polygon,
  position2: Vector,
  polygon2: Polygon
): boolean => {
  // Clone Polygons to get their absolute position
  const absolutePolygon1 = polygon1.clone().add(position1)
  const absolutePolygon2 = polygon2.clone().add(position2)

  // We need to test each polygon against each other
  return (
    absolutePolygon1.hasOverlapOnProjectionAxises(absolutePolygon2) &&
    absolutePolygon2.hasOverlapOnProjectionAxises(absolutePolygon1)
  )
}
