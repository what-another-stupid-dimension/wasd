import { Range, shapes, Vector } from '@wasd/math'
import { Type } from '../collision'

export default interface Properties {
  // An anchor to attach an riged body to (like a ball on a rope simulation etc)
  anchor?: Vector | null
  anchorDistance?: Range | null

  // Collision
  collisionShape?: shapes.Shape | null // Bodies without a collisionShape (null) will not collide with anything
  collisionType?: Type

  // Realistic Collision Response
  mass?: number // Bodies with an infinite mass will not response on collisions

  // Movement
  velocity?: Vector
  acceleration?: Vector
}
