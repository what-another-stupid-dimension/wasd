import {
    Box,
    Capsule,
    Polygon,
    Sphere,
} from '../shape'
import { GeometryUtil, Vector3 } from '../geometry'
import AABB from './AABB'
import { CollisionFunction, CollisionResult } from './types'
import SAT from './SAT'
import { Body, RigidBody } from '../body'

export default class CollisionDetection {
    private static collisionFunctions = new Map([
        [
            [Box.name, Box.name],
            CollisionDetection.detectBoxBoxCollision as CollisionFunction,
        ],
        [
            [Box.name, Sphere.name],
            CollisionDetection.detectBoxSphereCollision as CollisionFunction,
        ],
        [
            [Box.name, Capsule.name],
            CollisionDetection.detectBoxCapsuleCollision as CollisionFunction,
        ],
        [
            [Box.name, Polygon.name],
            CollisionDetection.detectBoxPolygonCollision as CollisionFunction,
        ],
        [
            [Capsule.name, Capsule.name],
            CollisionDetection.detectCapsuleCapsuleCollision as CollisionFunction,
        ],
        [
            [Capsule.name, Polygon.name],
            CollisionDetection.detectCapsulePolygonCollision as CollisionFunction,
        ],
        [
            [Capsule.name, Sphere.name],
            CollisionDetection.detectCapsuleSphereCollision as CollisionFunction,
        ],
        [
            [Sphere.name, Sphere.name],
            CollisionDetection.detectSphereSphereCollision as CollisionFunction,
        ],
        [
            [Sphere.name, Polygon.name],
            CollisionDetection.detectSpherePolygonCollision as CollisionFunction,
        ],
        [
            [Polygon.name, Polygon.name],
            CollisionDetection.detectPolygonPolygonCollision as CollisionFunction,
        ],
    ])

    public static detectCollision(body1: Body, body2: Body): CollisionResult {
        if (body1 instanceof RigidBody && body2 instanceof RigidBody) {
            return CollisionDetection.detectRigidBodyCollision(body1, body2)
        }

        return null
    }

    public static detectRigidBodyCollision(body1: RigidBody, body2: RigidBody): CollisionResult {
        const shape1 = body1.collider.shape
        const shape2 = body2.collider.shape
        const shapePair = [shape1.constructor.name, shape2.constructor.name].sort()

        const collisionFunction = CollisionDetection.collisionFunctions.get(shapePair)

        if (collisionFunction) {
            return collisionFunction(shape1, shape2)
        }

        return null
    }

    public static detectBoxBoxCollision(
        box1: Box,
        box2: Box,
    ): CollisionResult {
        return AABB.testCollision(box1, box2)
    }

    public static detectBoxCapsuleCollision(
        box: Box,
        capsule: Capsule,
    ): CollisionResult | null {
        const [start, end] = capsule.getEndPoints()
        const boxVertices = box.getVertices()

        // Find the closest point on the capsule's line segment to any box vertex
        let closestPoint: Vector3 | null = null
        let minDistance = Infinity

        // eslint-disable-next-line no-restricted-syntax
        for (const vertex of boxVertices) {
            const pointOnSegment = GeometryUtil.closestPointOnLineSegment(vertex, start, end)
            const distance = Vector3.distance(pointOnSegment, capsule.position)

            if (distance < minDistance) {
                minDistance = distance
                closestPoint = pointOnSegment
            }
        }

        // Check for collision based on the capsule's radius
        if (closestPoint && minDistance < capsule.radius) {
            const normal = closestPoint.subtract(capsule.position).normalize()
            return { normal, depth: capsule.radius - minDistance }
        }

        return null
    }

    public static detectBoxPolygonCollision(
        box: Box,
        polygon: Polygon,
    ): CollisionResult {
    // Test AABB with bounding boxes first, as SAT is expensive
        if (!AABB.intersects(box.getBoundingBox(), polygon.getBoundingBox())) return null

        return SAT.testCollision(box.getVertices(), polygon.vertices)
    }

    public static detectBoxSphereCollision(box: Box, sphere: Sphere): CollisionResult {
        const { min } = box
        const { max } = box

        const closestPoint = new Vector3(
            Math.max(min.x, Math.min(sphere.position.x, max.x)),
            Math.max(min.y, Math.min(sphere.position.y, max.y)),
            Math.max(min.z, Math.min(sphere.position.z, max.z)),
        )

        const distance = Vector3.distance(closestPoint, sphere.position)
        if (distance < sphere.radius) {
            const normal = sphere.position.subtract(closestPoint).normalize()
            return { normal, depth: sphere.radius - distance }
        }

        return null
    }

    public static detectCapsuleCapsuleCollision(
        capsule1: Capsule,
        capsule2: Capsule,
    ): CollisionResult {
        const [start1, end1] = capsule1.getEndPoints()
        const [start2, end2] = capsule2.getEndPoints()

        const closestPoint1 = GeometryUtil.closestPointOnLineSegment(start1, start2, end2)
        const closestPoint2 = GeometryUtil.closestPointOnLineSegment(start2, start1, end1)

        const distance = Vector3.distance(closestPoint1, closestPoint2)

        if (distance < (capsule1.radius + capsule2.radius)) {
            const normal = closestPoint1.subtract(closestPoint2).normalize()
            return { normal, depth: (capsule1.radius + capsule2.radius) - distance }
        }

        return null
    }

    public static detectCapsulePolygonCollision(
        capsule: Capsule,
        polygon: Polygon,
    ): CollisionResult | null {
        // Test AABB with bounding boxes first, as SAT is expensive
        if (!AABB.intersects(capsule.getBoundingBox(), polygon.getBoundingBox())) return null

        const [start, end] = capsule.getEndPoints()
        let closestPoint: Vector3 | null = null
        let minDistance = Infinity

        // Treat the capsule as a line segment, checking against each polygon edge
        for (let i = 0; i < polygon.vertices.length; i += 1) {
            const a = polygon.vertices[i]
            const b = polygon.vertices[(i + 1) % polygon.vertices.length]

            // Find the closest point on the capsule segment to this polygon edge
            const pointOnCapsule = GeometryUtil.closestPointOnLineSegment(a, start, end)
            const pointOnEdge = GeometryUtil.closestPointOnLineSegment(pointOnCapsule, a, b)
            const distance = Vector3.distance(pointOnEdge, pointOnCapsule)

            if (distance < minDistance) {
                minDistance = distance
                closestPoint = pointOnEdge
            }
        }

        // Check if there's an intersection
        if (closestPoint && minDistance < capsule.radius) {
            const normal = start.subtract(closestPoint).normalize()
            return { normal, depth: capsule.radius - minDistance }
        }

        return null
    }

    public static detectCapsuleSphereCollision(
        capsule: Capsule,
        sphere: Sphere,
    ): CollisionResult {
        const [start, end] = capsule.getEndPoints()
        const closestPoint = GeometryUtil.closestPointOnLineSegment(sphere.position, start, end)
        const distance = Vector3.distance(closestPoint, sphere.position)

        if (distance < (sphere.radius + capsule.radius)) {
            const normal = sphere.position.subtract(closestPoint).normalize()
            return { normal, depth: (sphere.radius + capsule.radius) - distance }
        }

        return null
    }

    public static detectPolygonPolygonCollision(
        polygon1: Polygon,
        polygon2: Polygon,
    ): CollisionResult {
        // Test AABB with bounding boxes first, as SAT is expensive
        if (!AABB.intersects(polygon1.getBoundingBox(), polygon2.getBoundingBox())) return null

        return SAT.testCollision(polygon1.vertices, polygon2.vertices)
    }

    public static detectSpherePolygonCollision(
        sphere: Sphere,
        polygon: Polygon,
    ): { collision: boolean, normal: Vector3, depth: number } | null {
        const closestPoint = GeometryUtil.closestPointOnPolygon(sphere.position, polygon)
        const distance = Vector3.distance(closestPoint, sphere.position)

        if (distance < sphere.radius) {
            const normal = sphere.position.subtract(closestPoint).normalize()
            return { collision: true, normal, depth: sphere.radius - distance }
        }

        return null
    }

    public static detectSphereSphereCollision(
        sphere1: Sphere,
        sphere2: Sphere,
    ): CollisionResult {
        const distance = Vector3.distance(sphere1.position, sphere2.position)
        if (distance < (sphere1.radius + sphere2.radius)) {
            const normal = sphere1.position.subtract(sphere2.position).normalize()
            return { normal, depth: (sphere1.radius + sphere2.radius) - distance }
        }
        return null
    }
}
