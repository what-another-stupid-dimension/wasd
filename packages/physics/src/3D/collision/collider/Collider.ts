import { Vector3 } from '../../geometry'
import { Shape } from '../../shape'
import Material from './Material'

class Collider {
    constructor(
        public shape: Shape,
        public material: Material,
        public offset: Vector3 = Vector3.zero(),
    ) { }
}

export default Collider
