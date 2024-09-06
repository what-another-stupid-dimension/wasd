import Vector3 from '../geometry/Vector3'
import { Shape } from '../shape'

export interface CollisionDetails {
    normal: Vector3,
    depth: number
}

export type CollisionResult = CollisionDetails | null

export type CollisionFunction = (shape1: Shape, shape2: Shape) => CollisionResult
