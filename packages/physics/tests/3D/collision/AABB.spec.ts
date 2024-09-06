import {
    describe,
    beforeEach,
    expect,
    it,
} from '@jest/globals'
import { Vector3, Box, AABB } from '../../../src/3D'

describe('AABB - Axis-Aligned Bounding Box collision operations', () => {
    let box1: Box
    let box2: Box

    beforeEach(() => {
        // Setting up two overlapping boxes for basic intersection tests
        box1 = new Box(new Vector3(0, 0, 0), new Vector3(5, 5, 5))
        box2 = new Box(new Vector3(4, 4, 4), new Vector3(10, 10, 10))
    })

    describe('.intersects - Checking box intersections', () => {
        it('should return true when boxes intersect', () => {
            expect(AABB.intersects(box1, box2)).toBe(true)
        })

        it('should return false for non-intersecting boxes', () => {
            const box3 = new Box(new Vector3(6, 6, 6), new Vector3(10, 10, 10))
            expect(AABB.intersects(box1, box3)).toBe(false)
        })

        it('should detect touching boxes as intersecting', () => {
            const box3 = new Box(new Vector3(5, 5, 5), new Vector3(10, 10, 10))
            expect(AABB.intersects(box1, box3)).toBe(true)
        })
    })

    describe('.testCollision - Getting collision details', () => {
        it('should return collision details when boxes intersect', () => {
            const result = AABB.testCollision(box1, box2)
            expect(result).toBeTruthy()
            expect(result!.depth).toBeGreaterThan(0)
            expect(result!.normal).toBeDefined()
        })

        it('should return null for non-intersecting boxes', () => {
            const box3 = new Box(new Vector3(6, 6, 6), new Vector3(10, 10, 10))
            expect(AABB.testCollision(box1, box3)).toBeNull()
        })

        it('should return null collision when boxes are just touching', () => {
            const box3 = new Box(new Vector3(5, 5, 5), new Vector3(10, 10, 10))
            const result = AABB.testCollision(box1, box3)
            expect(result).toBeNull()
        })
    })
})
