import Shape, { ShapeType } from './shape'
import Vector from './vector'

export interface ProjectionAxisRange {
  min: number
  max: number
}

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

  getProjectionAxisRange(projectionAxis: Vector): ProjectionAxisRange {
    let min: number = Number.MAX_SAFE_INTEGER
    let max: number = Number.MIN_SAFE_INTEGER

    this.points.forEach(point => {
      const range = point.x * projectionAxis.x + point.y * projectionAxis.y
      min = Math.min(min, range)
      max = Math.max(max, range)
    })

    return { min, max }
  }
}
