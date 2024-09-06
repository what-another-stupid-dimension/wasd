import {
    describe,
    beforeEach,
    expect,
    it,
} from '@jest/globals'
import { Vector3 } from '../../../src/3D'

describe('Vector3 - 3D vector operations', () => {
    let v1: Vector3
    let v2: Vector3

    beforeEach(() => {
        // Initial vectors for testing basic operations
        v1 = new Vector3(1, 2, 3)
        v2 = new Vector3(4, -5, 6)
    })

    describe('.add - Vector addition', () => {
        it('should add two vectors component-wise', () => {
            const result = v1.add(v2)
            expect(result).toEqual(new Vector3(5, -3, 9))
        })

        it('should not change the vector when adding a zero vector', () => {
            const zeroVector = new Vector3(0, 0, 0)
            const result = v1.add(zeroVector)
            expect(result).toEqual(v1)
        })
    })

    describe('.subtract - Vector subtraction', () => {
        it('should subtract two vectors component-wise', () => {
            const result = v1.subtract(v2)
            expect(result).toEqual(new Vector3(-3, 7, -3))
        })

        it('should return the original vector when subtracting the zero vector', () => {
            const zeroVector = new Vector3(0, 0, 0)
            const result = v1.subtract(zeroVector)
            expect(result).toEqual(v1)
        })
    })

    describe('.dot - Dot product of two vectors', () => {
        it('should calculate the dot product correctly', () => {
            expect(v1.dot(v2)).toBe(12)
        })

        it('should return zero when vectors are perpendicular', () => {
            const v3 = new Vector3(-2, 1, 0) // Perpendicular to v1
            expect(v1.dot(v3)).toBe(0)
        })
    })

    describe('.cross - Cross product of two vectors', () => {
        it('should return a vector perpendicular to the input vectors', () => {
            const result = v1.cross(v2)
            expect(result).toEqual(new Vector3(27, 6, -13))
        })

        it('should result in a zero vector when vectors are parallel', () => {
            const parallelVector = new Vector3(2, 4, 6)
            const result = v1.cross(parallelVector)
            expect(result).toEqual(new Vector3(0, 0, 0))
        })
    })

    describe('.magnitude - Length of the vector', () => {
        it('should calculate the magnitude (Euclidean norm) correctly', () => {
            expect(v1.magnitude()).toBeCloseTo(3.7417, 4)
        })

        it('should return zero for the zero vector', () => {
            const zeroVector = new Vector3(0, 0, 0)
            expect(zeroVector.magnitude()).toBe(0)
        })
    })

    describe('.normalize - Normalizing a vector', () => {
        it('should return a unit vector in the same direction', () => {
            const result = v1.normalize()
            expect(result.magnitude()).toBeCloseTo(1, 4)
        })

        it('should return the zero vector unchanged when normalizing it', () => {
            const zeroVector = new Vector3(0, 0, 0)
            const result = zeroVector.normalize()
            expect(result).toEqual(zeroVector)
        })
    })
})
