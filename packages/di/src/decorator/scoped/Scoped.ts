import 'reflect-metadata'
import { SCOPED_METADATA_KEY } from './constants'

export default (): ClassDecorator => (instance: Object) => {
    Reflect.defineMetadata(SCOPED_METADATA_KEY, true, instance)
}
