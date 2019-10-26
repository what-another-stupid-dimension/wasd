import { Vector, Rectangle } from '../geometry'

/**
 * Axis-Aligned Bounding Box
 * @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */
export default (
  position1: Vector,
  rectangle1: Rectangle,
  position2: Vector,
  rectangle2: Rectangle
): boolean =>
  position1.x < position2.x + rectangle2.width &&
  position1.x + rectangle1.width > position2.x &&
  position1.y < position2.y + rectangle2.height &&
  position1.y + rectangle1.height > position2.y
