import Shape, { ShapeType } from './shape'

export default class Circle implements Shape {
  type: ShapeType = ShapeType.Circle

  public radius: number

  static isCircle(shape: Shape): shape is Circle {
    return shape instanceof Circle
  }

  constructor(radius: number) {
    this.radius = radius
  }
}
