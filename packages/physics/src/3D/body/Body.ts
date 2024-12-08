import { v4 as uuidv4 } from 'uuid'
import { Vector3 } from '../geometry'
import { Box } from '../shape'
import { BodyProperties } from './types'

export default abstract class Body {
    public id

    public position: Vector3

    public mass: number

    public velocity: Vector3

    public forces: Vector3[]

    public torques: Vector3[]

    public orientation: Vector3

    public angularVelocity: Vector3

    public isStatic: boolean

    constructor({
        id = uuidv4(),
        position,
        mass,
        velocity = Vector3.zero(),
        forces = [],
        torques = [],
        orientation = Vector3.zero(),
        angularVelocity = Vector3.zero(),
        isStatic = false,
    }: BodyProperties) {
        this.id = id
        this.position = position
        this.mass = mass
        this.velocity = velocity
        this.forces = forces
        this.torques = torques
        this.orientation = orientation
        this.angularVelocity = angularVelocity
        this.isStatic = isStatic
    }

    applyForce(force: Vector3): void {
        this.forces.push(force)
    }

    applyTorque(force: Vector3): void {
        this.torques.push(force)
    }

    clampPosition(boundary: Box): void {
        const { min, max } = boundary

        this.position.x = Math.max(min.x, Math.min(this.position.x, max.x))
        this.position.y = Math.max(min.y, Math.min(this.position.y, max.y))
        this.position.z = Math.max(min.z, Math.min(this.position.z, max.z))
    }

    update(deltaTime: number, boundary?: Box): void {
        if (this.isStatic) return

        // Sum all forces acting on the body
        const totalForce = this.forces.reduce(
            (acc, force) => acc.add(force),
            Vector3.zero(),
        )

        // Compute acceleration (a = F / m)
        const forceAcceleration = totalForce.multiply(1 / this.mass)

        // Update velocity (v = v + a * dt)
        this.velocity = this.velocity.add(forceAcceleration.multiply(deltaTime))

        // Update position (p = p + v * dt)
        this.position = this.position.add(this.velocity.multiply(deltaTime))

        // Clear forces after each update
        this.forces = []

        // Update orientation and angular velocity (optional, depending on your physics)
        const totalTorque = this.torques.reduce(
            (acc, torque) => acc.add(torque),
            Vector3.zero(),
        )
        const angularAcceleration = totalTorque.multiply(1 / this.mass) // Simplified moment of inertia
        this.angularVelocity = this.angularVelocity.add(
            angularAcceleration.multiply(deltaTime),
        )
        this.orientation = this.orientation.add(
            this.angularVelocity.multiply(deltaTime),
        )
        this.torques = []

        if (boundary) {
            this.clampPosition(boundary)
        }
    }

    serialize(): object {
        return {
            id: this.id,
            position: this.position.toArray(), // Convert Vector3 to [x, y, z]
            velocity: this.velocity.toArray(),
            angularVelocity: this.angularVelocity.toArray(),
            orientation: this.orientation.toArray(),
        }
    }

    abstract getBoundingBox(): Box
}
