import { Collider } from '../collision/collider'
import { Vector3 } from '../geometry'

export interface BodyProperties {
    id?: string,
    position: Vector3
    mass: number
    velocity?: Vector3
    forces?: Vector3[]
    torques?: Vector3[]
    orientation?: Vector3
    angularVelocity?: Vector3
    isStatic?: boolean
}

export interface RigidBodyProperties extends BodyProperties {
    collider: Collider,
}
