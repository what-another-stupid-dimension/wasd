import Shape from './shape'
import Type from './type'

export default class Point implements Shape {
  type: Type = Type.Point

  static isPoint(shape: Shape): shape is Point {
    return shape instanceof Point
  }
}
