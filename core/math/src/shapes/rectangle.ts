import Shape from './shape'
import Type from './type'

export default class Rectangle implements Shape {
  type: Type = Type.Rectangle

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
