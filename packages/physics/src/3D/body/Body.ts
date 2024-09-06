import { Vector3 } from '../geometry'
import { Box } from '../shape'
import { BodyProperties } from './types'

export default abstract class Body {
    public position: Vector3

    public mass: number

    public velocity: Vector3

    public forces: Vector3[]

    public torques: Vector3[]

    public orientation: Vector3

    public angularVelocity: Vector3

    public isStatic: boolean

    constructor({
        position,
        mass,
        velocity = Vector3.zero(),
        forces = [],
        torques = [],
        orientation = Vector3.zero(),
        angularVelocity = Vector3.zero(),
        isStatic = false,
    }: BodyProperties) {
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

    abstract getBoundingBox(): Box
}
