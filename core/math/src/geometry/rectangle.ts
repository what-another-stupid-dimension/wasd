import Shape, { ShapeType } from './shape'

export default class Rectangle implements Shape {
  type: ShapeType = ShapeType.Rectangle

  public width: number

  public height: number

  public angle: number

  static isRectangle(shape: Shape): shape is Rectangle {
    return shape instanceof Rectangle
  }

  constructor(width: number, height: number, angle = 0) {
    this.width = width
    this.height = height
    this.angle = angle
  }
}
