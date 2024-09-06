import Vector3 from '../geometry/Vector3'
import { Box } from '../shape'
import { CollisionResult } from './types'

export default class AABB {
    static intersects(box1: Box, box2: Box): boolean {
        return (
            box1.min.x <= box2.max.x && box1.max.x >= box2.min.x
            && box1.min.y <= box2.max.y && box1.max.y >= box2.min.y
            && box1.min.z <= box2.max.z && box1.max.z >= box2.min.z
        )
    }

    static testCollision(box1: Box, box2: Box): CollisionResult {
        const overlapX = Math.min(box1.max.x - box2.min.x, box2.max.x - box1.min.x)
        const overlapY = Math.min(box1.max.y - box2.min.y, box2.max.y - box1.min.y)
        const overlapZ = Math.min(box1.max.z - box2.min.z, box2.max.z - box1.min.z)

        // If no overlap in any dimension, return null (no collision)
        if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {
            return null
        }

        // Find the axis of minimum penetration
        let depth = overlapX
        let normal = new Vector3(
            Math.sign(box1.min.x + box1.max.x - box2.min.x - box2.max.x),
            0,
            0,
        )

        if (overlapY < depth) {
            depth = overlapY
            normal = new Vector3(
                0,
                Math.sign(box1.min.y + box1.max.y - box2.min.y - box2.max.y),
                0,
            )
        }

        if (overlapZ < depth) {
            depth = overlapZ
            normal = new Vector3(
                0,
                0,
                Math.sign(box1.min.z + box1.max.z - box2.min.z - box2.max.z),
            )
        }

        return { normal, depth }
    }
}
