import Shape, { ShapeType } from './shape'
import Vector from './vector'
import Range from './range'

export default class Polygon implements Shape {
  type: ShapeType = ShapeType.Polygon

  public points: Vector[]

  public angle: number

  static isPolygon(shape: Shape): shape is Polygon {
    return shape instanceof Polygon
  }

  constructor(points: Vector[], angle = 0) {
    this.points = points
    this.angle = angle
  }

  clone(): Polygon {
    return new Polygon(this.points, this.angle)
  }

  add(vector: Vector): Polygon {
    this.points = this.points.map(point => {
      return point.add(vector)
    })

    return this
  }

  getProjectionAxisRange(projectionAxis: Vector): Range {
    let min: number = Number.MAX_SAFE_INTEGER
    let max: number = Number.MIN_SAFE_INTEGER

    this.points.forEach(point => {
      const range = point.x * projectionAxis.x + point.y * projectionAxis.y
      min = Math.min(min, range)
      max = Math.max(max, range)
    })

    return new Range(min, max)
  }

  hasOverlapOnProjectionAxises(polygon: Polygon): boolean {
    // We need to iterate over all points of the projectingPolygon to create all projecting axises
    for (let i = 0; i < this.points.length; i += 1) {
      // Create axis projection for the lint between current and next point
      const projectionAxis = this.points[i].projectionAxis(
        this.points[(i + 1) % this.points.length]
      )

      // Get the ranges on the projection Axises
      const projectingPolygonRange = this.getProjectionAxisRange(projectionAxis)
      const interferingPolygonRange = polygon.getProjectionAxisRange(
        projectionAxis
      )

      // Now lets check if the polygons ranges on the projection axis are overlapping
      if (!projectingPolygonRange.isOverlapping(interferingPolygonRange)) {
        // As soon as the two polygons has no overlap on any projection axis they do not collide
        return false
      }
    }

    return true
  }
}
