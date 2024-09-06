import {
    describe,
    beforeEach,
    expect,
    it,
} from '@jest/globals'
import {
    Vector3,
    Box,
    Sphere,
    CollsisionDetection,
} from '../../../src/3D'

describe('Detection - Collision Detection between Various Shapes', () => {
    let box: Box
    let sphere: Sphere

    beforeEach(() => {
        box = new Box(new Vector3(0, 0, 0), new Vector3(2, 2, 2))
        sphere = new Sphere(new Vector3(1, 1, 1), 1)
    })

    describe('.detectBoxBoxCollision - Detect collisions between two boxes', () => {
        it('should return CollisionDetails if two boxes are colliding', () => {
            const box2 = new Box(new Vector3(1, 1, 1), new Vector3(2, 2, 2))
            const result = CollsisionDetection.detectBoxBoxCollision(box, box2)
            expect(result?.depth).toBe(1)
            expect(result?.normal).toStrictEqual(new Vector3(-1, 0, 0))
        })

        it('should return null if two boxes are not colliding', () => {
            const box2 = new Box(new Vector3(5, 5, 5), new Vector3(2, 2, 2))
            const result = CollsisionDetection.detectBoxBoxCollision(box, box2)
            expect(result).toBeNull()
        })
    })

    describe('.detectBoxSphereCollision - Detect collision between a box and a sphere', () => {
        it('should return CollisionDetails if a box and a sphere collide', () => {
            const result = CollsisionDetection.detectBoxSphereCollision(box, sphere)
            expect(result?.depth).toBe(1)
            expect(result?.normal).toStrictEqual(new Vector3(1, 0, 0))
        })

        it('should return null if a box and a sphere do not collide', () => {
            const sphere2 = new Sphere(new Vector3(10, 10, 10), 1)
            const result = CollsisionDetection.detectBoxSphereCollision(box, sphere2)
            expect(result).toBeNull()
        })
    })
})
