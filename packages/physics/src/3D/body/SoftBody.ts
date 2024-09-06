import { Box } from '../shape'
import Body from './Body'

class SoftBody extends Body {
    getBoundingBox(): Box {
        throw new Error('Soft Body Dynamics not implemented')
    }
}

export default SoftBody
