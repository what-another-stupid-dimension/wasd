import { Vector3 } from '../geometry'
import { Box } from '../shape'
import { Collider } from '../collision/collider'
import { RigidBodyProperties } from './types'
import Body from './Body'

class RigidBody extends Body {
    public collider: Collider

    constructor({
        collider,
        ...props
    }: RigidBodyProperties) {
        super(props)

        this.collider = collider
    }

    applyForce(force: Vector3): void {
        if (!this.isStatic) {
            this.forces.push(force)
        }
    }

    applyTorque(force: Vector3): void {
        if (!this.isStatic) {
            this.torques.push(force)
        }
    }

    getBoundingBox(): Box {
        return new Box(this.position, this.position)
    }

    serialize(): object {
        return {
            ...super.serialize(),
            collider: this.collider.serialize(),
        }
    }
}

export default RigidBody
