import { Vector } from '@wasd/math'
import { Type } from '../collision'
import Properties from './properties'

type Constructor<T = {}> = new (...args: any[]) => T
export default (properties: Properties): Function => {
  const resolvedProperties: Properties = {
    anchor: null,
    anchorDistance: null,
    collisionShape: null,
    collisionType: Type.Ignore,
    mass: 1,
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
    ...properties
  }

  return <RigidBodyConstructor extends Constructor>(
    constructor: RigidBodyConstructor
  ): RigidBodyConstructor =>
    class extends constructor {
      anchor = resolvedProperties.anchor

      anchorDistance = resolvedProperties.anchorDistance

      collisionShape = resolvedProperties.collisionShape

      collisionType = resolvedProperties.collisionType

      mass = resolvedProperties.mass

      velocity = resolvedProperties.velocity

      acceleration = resolvedProperties.acceleration
    }
}
