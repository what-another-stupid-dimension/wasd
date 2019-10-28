import { Shape, Vector } from '@wasd/math'

export interface RigedBodyProperties {
  // Collision
  collisionShape?: Shape | null // Bodies without a collisionShape (null) will not collide with anything

  // Realistic Collision Response
  mass?: number | 'Infinity' // Bodies with an infinite mass will not response on collisions
  elasticDeformation?: number // Elastic deformation (https://en.wikipedia.org/wiki/Deformation_(engineering))

  // Movement
  velocity?: Vector
  acceleration?: Vector
}

export default (properties: RigedBodyProperties): Function => {
  const resolvedProperties: RigedBodyProperties = {
    mass: 1,
    elasticDeformation: 0.5,
    collisionShape: null,
    velocity: new Vector(0, 0),
    acceleration: new Vector(0, 0),
    ...properties
  }

  return <BaseConstructor extends { new (...args: any[]): {} }>(
    constructor: BaseConstructor
  ): { new (): RigedBodyProperties } =>
    class extends constructor {
      mass = resolvedProperties.mass

      elasticDeformation = resolvedProperties.elasticDeformation

      collisionShape = resolvedProperties.collisionShape

      velocity = resolvedProperties.velocity

      acceleration = resolvedProperties.acceleration
    }
}
