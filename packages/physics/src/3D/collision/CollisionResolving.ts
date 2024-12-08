import { Body, RigidBody } from '../body'
import { Vector3 } from '../geometry'
import { CollisionDetails, CollisionResult } from './types'

export default class CollisionResolving {
    private static readonly CORRECTION_FACTOR = 0.8

    public static resolveCollision(
        body1: Body,
        body2: Body,
        collision: CollisionResult,
    ): void {
        if (body1 instanceof RigidBody && body2 instanceof RigidBody) {
            return CollisionResolving.resolveRigidBodyCollision(body1, body2, collision)
        }

        return undefined
    }

    public static resolveRigidBodyCollision(
        body1: RigidBody,
        body2: RigidBody,
        collision: CollisionResult,
    ): void {
        if (!collision || (body1.isStatic && body2.isStatic)) return

        const { normal, depth } = collision as CollisionDetails
        const restitution = CollisionResolving.calculateRestitution(body1, body2)
        const friction = CollisionResolving.calculateFriction(body1, body2)

        // Calculate impulses and resolve velocities
        const impulse = CollisionResolving.calculateImpulse(body1, body2, normal, restitution)
        CollisionResolving.applyImpulse(body1, body2, impulse)

        // Calculate and apply friction
        const frictionImpulse = CollisionResolving.calculateFrictionImpulse(
            body1,
            body2,
            normal,
            friction,
        )
        CollisionResolving.applyImpulse(body1, body2, frictionImpulse)

        // Position correction to resolve penetration
        CollisionResolving.correctPosition(body1, body2, normal, depth)
    }

    private static calculateRestitution(body1: RigidBody, body2: RigidBody): number {
        return Math.min(body1.collider.material.restitution, body2.collider.material.restitution)
    }

    private static calculateFriction(body1: RigidBody, body2: RigidBody): number {
        return Math.min(body1.collider.material.friction, body2.collider.material.friction)
    }

    private static calculateImpulse(
        body1: RigidBody,
        body2: RigidBody,
        normal: Vector3,
        restitution: number,
    ): Vector3 {
        const relativeVelocity = body2.velocity.subtract(body1.velocity)
        const velocityAlongNormal = relativeVelocity.dot(normal)

        if (velocityAlongNormal > 0) return Vector3.zero() // Bodies are moving apart

        const impulseMagnitude = -((1 + restitution) * velocityAlongNormal)
         / (body1.mass + body2.mass)
        return normal.multiply(impulseMagnitude)
    }

    private static applyImpulse(
        body1: RigidBody,
        body2: RigidBody,
        impulse: Vector3,
    ): void {
        if (!impulse.isZero()) {
            if (!body1.isStatic && body1.mass > 0) {
                body1.velocity = body1.velocity.subtract(impulse.multiply(1 / body1.mass))
            }
            if (!body2.isStatic && body2.mass > 0) {
                body2.velocity = body2.velocity.add(impulse.multiply(1 / body2.mass))
            }
        }
    }

    private static calculateFrictionImpulse(
        body1: RigidBody,
        body2: RigidBody,
        normal: Vector3,
        friction: number,
    ): Vector3 {
        const relativeVelocity = body2.velocity.subtract(body1.velocity)
        const velocityAlongNormal = relativeVelocity.dot(normal)

        const tangent = relativeVelocity.subtract(normal.multiply(velocityAlongNormal)).normalize()
        const frictionImpulseMagnitude = -relativeVelocity.dot(tangent) * friction
        return tangent.multiply(frictionImpulseMagnitude)
    }

    private static correctPosition(
        body1: RigidBody,
        body2: RigidBody,
        normal: Vector3,
        depth: number,
    ): void {
        const correction = normal.multiply(
            (depth / (body1.mass + body2.mass)) * CollisionResolving.CORRECTION_FACTOR,
        )

        if (!body1.isStatic) {
            body1.position = body1.position.subtract(correction.multiply(1 / body1.mass))
        }
        if (!body2.isStatic) {
            body2.position = body2.position.add(correction.multiply(1 / body2.mass))
        }
    }
}
