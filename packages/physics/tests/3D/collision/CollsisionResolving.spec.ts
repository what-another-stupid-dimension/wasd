import {
    describe,
    beforeEach,
    expect,
    it,
} from '@jest/globals'
import {
    Vector3,
    Box,
    CollsisionResolving,
    RigidBody,
    Collider,
    ColliderMaterial,
    CollisionResult,
} from '../../../src/3D'

describe('CollsisionResolving - Collision resolution between rigid bodies', () => {
    let bodyA: RigidBody
    let bodyB: RigidBody
    let collisionResult: CollisionResult

    describe('.resolveCollision - Collision response', () => {
        beforeEach(() => {
        // Set up two rigid bodies with colliders for testing resolution
            const colliderA = new Collider(
                new Box(new Vector3(0, 0, 0), new Vector3(2, 2, 2)),
                new ColliderMaterial(),
            )
            const colliderB = new Collider(
                new Box(new Vector3(1, 1, 1), new Vector3(3, 3, 3)),
                new ColliderMaterial(),
            )
            bodyA = new RigidBody({ collider: colliderA, position: new Vector3(0, 0, 0), mass: 5 })
            bodyB = new RigidBody({ collider: colliderB, position: new Vector3(1, 1, 1), mass: 5 })
            collisionResult = {
                normal: new Vector3(1, 0, 0),
                depth: 1,
            }
        })

        it('should adjust velocities of both bodies during a collision', () => {
            CollsisionResolving.resolveCollision(bodyA, bodyB, collisionResult)
            expect(bodyA.velocity).toBeDefined()
            expect(bodyB.velocity).toBeDefined()
        })

        it('should not change velocity of an immovable body (zero mass)', () => {
            bodyA.mass = 0
            CollsisionResolving.resolveCollision(bodyA, bodyB, collisionResult)
            expect(bodyA.velocity).toEqual(new Vector3(0, 0, 0))
            expect(bodyB.velocity).toBeDefined()
        })

        it('should skip velocity adjustments if collision depth is zero', () => {
            collisionResult = { normal: new Vector3(1, 0, 0), depth: 0 }
            const initialVelocityA = bodyA.velocity.clone()
            const initialVelocityB = bodyB.velocity.clone()
            CollsisionResolving.resolveCollision(bodyA, bodyB, collisionResult)
            expect(bodyA.velocity).toEqual(initialVelocityA)
            expect(bodyB.velocity).toEqual(initialVelocityB)
        })

        it('should apply no adjustments when both bodies have zero mass', () => {
            bodyA.mass = 0
            bodyB.mass = 0
            CollsisionResolving.resolveCollision(bodyA, bodyB, collisionResult)
            expect(bodyA.velocity).toEqual(new Vector3(0, 0, 0))
            expect(bodyB.velocity).toEqual(new Vector3(0, 0, 0))
        })
    })
})
