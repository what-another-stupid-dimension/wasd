import { Range, Vector, shapes } from '@wasd/math'
import RigedBody from '../rigidBody'
import Properties from '../properties'
import { Type } from '../../collision'

export const props: Properties = {
  anchor: new Vector(15, 15),
  anchorDistance: new Range(200, 200),
  collisionShape: new shapes.Circle(20),
  collisionType: Type.Elastic,
  mass: 1.5,
  velocity: new Vector(5, 5),
  acceleration: new Vector(10, 10)
}

class MyGameObject {
  testProperty: string

  constructor(testProperty: string) {
    this.testProperty = testProperty
  }
}

export default RigedBody(props)(MyGameObject)
