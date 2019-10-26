import Shape, { ShapeType } from './shape'

export default class Point implements Shape {
  type: ShapeType = ShapeType.Point

  static isPoint(shape: Shape): shape is Point {
    return shape instanceof Point
  }
}
