import Shape from './shape'
import Type from './type'

export default class Circle implements Shape {
  type: Type = Type.Circle

  public radius: number

  static isCircle(shape: Shape): shape is Circle {
    return shape instanceof Circle
  }

  constructor(radius: number) {
    this.radius = radius
  }
}
