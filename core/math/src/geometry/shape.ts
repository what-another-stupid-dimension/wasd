export enum ShapeType {
  Point = 'point',
  Circle = 'circle',
  Polygon = 'polygon',
  Rectangle = 'rectangle'
}
export default interface Shape {
  type: ShapeType
}
