import { Vector3 } from '../../geometry'
import { Shape } from '../../shape'
import Material from './Material'

class Collider {
    constructor(
        public shape: Shape,
        public material: Material,
        public offset: Vector3 = Vector3.zero(),
    ) { }

    serialize(): object {
        return {
            shape: this.shape.serialize(),
            material: this.material.serialize(),
            offset: this.offset.toArray(),
        }
    }
}

export default Collider
