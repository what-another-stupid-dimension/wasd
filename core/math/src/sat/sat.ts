import { Polygon, Vector, ProjectionAxisRange } from '../geometry'

export const areProjectionAxisRangesOverlapping = (
  range1: ProjectionAxisRange,
  range2: ProjectionAxisRange
): boolean => {
  return range2.max >= range1.min && range1.max >= range2.min
}

export const isShadowAxisOverlapping = (
  sourcePolygon: Polygon,
  comparePolygon: Polygon
): boolean => {
  for (let i = 0; i < sourcePolygon.points.length; i += 1) {
    // Create axis projection for the lint between current and next point
    const projectionAxis = sourcePolygon.points[i].projectionAxis(
      sourcePolygon.points[(i + 1) % sourcePolygon.points.length]
    )
    // Now lets check if the polygons ranges on the projection axis are overlapping
    if (
      !areProjectionAxisRangesOverlapping(
        sourcePolygon.getProjectionAxisRange(projectionAxis),
        comparePolygon.getProjectionAxisRange(projectionAxis)
      )
    ) {
      return false
    }
  }
  return true
}

export default (
  position1: Vector,
  polygon1: Polygon,
  position2: Vector,
  polygon2: Polygon
): boolean => {
  const absolutePolygon1 = polygon1.clone().add(position1)
  const absolutePolygon2 = polygon2.clone().add(position2)

  return (
    isShadowAxisOverlapping(absolutePolygon1, absolutePolygon2) &&
    isShadowAxisOverlapping(absolutePolygon2, absolutePolygon1)
  )
}
