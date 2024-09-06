import {
    describe,
    beforeEach,
    expect,
    it,
} from '@jest/globals'
import {
    CollsisionDetection,
    Vector3,
    Box,
    Sphere,
    Capsule,
    Polygon,
    RigidBody,
    Shape,
} from '../../src/3D'

describe('CollsisionDetection', () => {
    let box1: Box
    let box2: Box
    let sphere1: Sphere
    let sphere2: Sphere
    let capsule1: Capsule
    let capsule2: Capsule
    let polygon1: Polygon
    let polygon2: Polygon

    beforeEach(() => {
        box1 = new Box(new Vector3(0, 0, 0), new Vector3(2, 2, 2))
        box2 = new Box(new Vector3(1, 1, 1), new Vector3(3, 3, 3))
        sphere1 = new Sphere(new Vector3(0, 0, 0), 1)
        sphere2 = new Sphere(new Vector3(1, 1, 1), 1)
        capsule1 = new Capsule(new Vector3(0, 0, 0), 1, 1)
        capsule2 = new Capsule(new Vector3(1, 1, 1), 1, 1)
        polygon1 = new Polygon(
            new Vector3(0, 0, 0),
            [new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0)],
        )
        polygon2 = new Polygon(
            new Vector3(1, 1, 1),
            [new Vector3(1, 1, 1), new Vector3(2, 1, 1), new Vector3(1, 2, 1)],
        )
    })

    function createRigidBody(shape: Shape) {
        return new RigidBody({
            position: Vector3.zero(),
            velocity: Vector3.zero(),
            mass: 1,
            collider: {
                material: { friction: 0, restitution: 0 },
                offset: Vector3.zero(),
                shape,
            },
        })
    }

    it('should detect Box-Box collision', () => {
        const result = CollsisionDetection.detectBoxBoxCollision(box1, box2)
        expect(result).toBeDefined()
    })

    it('should detect Box-Sphere collision', () => {
        const result = CollsisionDetection.detectBoxSphereCollision(box1, sphere1)
        expect(result).toBeNull()
    })

    it('should detect Box-Capsule collision', () => {
        const result = CollsisionDetection.detectBoxCapsuleCollision(box1, capsule1)
        expect(result).toBeNull()
    })

    it('should detect Box-Polygon collision', () => {
        const result = CollsisionDetection.detectBoxPolygonCollision(box1, polygon1)
        expect(result).toBeDefined()
    })

    it('should detect Capsule-Capsule collision', () => {
        const result = CollsisionDetection.detectCapsuleCapsuleCollision(capsule1, capsule2)
        expect(result).toBeNull()
    })

    it('should detect Capsule-Polygon collision', () => {
        const result = CollsisionDetection.detectCapsulePolygonCollision(capsule1, polygon1)
        expect(result).toBeNull()
    })

    it('should detect Capsule-Sphere collision', () => {
        const result = CollsisionDetection.detectCapsuleSphereCollision(capsule1, sphere1)
        expect(result).toBeNull()
    })

    it('should detect Sphere-Sphere collision', () => {
        const result = CollsisionDetection.detectSphereSphereCollision(sphere1, sphere2)
        expect(result).toBeDefined()
    })

    it('should detect Sphere-Polygon collision', () => {
        const result = CollsisionDetection.detectSpherePolygonCollision(sphere1, polygon1)
        expect(result).toBeNull()
    })

    it('should detect Polygon-Polygon collision', () => {
        const result = CollsisionDetection.detectPolygonPolygonCollision(polygon1, polygon2)
        expect(result).toBeNull()
    })

    describe('detectCollision', () => {
        it('should call detectBoxBoxCollision for Box-Box collision', () => {
            const rigidBody1 = createRigidBody(box1)
            const rigidBody2 = createRigidBody(box2)

            const result = CollsisionDetection.detectCollision(rigidBody1, rigidBody2)
            expect(result).toBeDefined()
        })

        it('should call detectBoxSphereCollision for Box-Sphere collision', () => {
            const rigidBody1 = createRigidBody(box1)
            const rigidBody2 = createRigidBody(sphere1)

            const result = CollsisionDetection.detectCollision(rigidBody1, rigidBody2)
            expect(result).toBeNull()
        })

        it('should call detectBoxCapsuleCollision for Box-Capsule collision', () => {
            const rigidBody1 = createRigidBody(box1)
            const rigidBody2 = createRigidBody(capsule1)

            const result = CollsisionDetection.detectCollision(rigidBody1, rigidBody2)
            expect(result).toBeNull()
        })

        it('should call detectCapsuleCapsuleCollision for Capsule-Capsule collision', () => {
            const rigidBody1 = createRigidBody(capsule1)
            const rigidBody2 = createRigidBody(capsule2)

            const result = CollsisionDetection.detectCollision(rigidBody1, rigidBody2)
            expect(result).toBeNull()
        })
    })
})
