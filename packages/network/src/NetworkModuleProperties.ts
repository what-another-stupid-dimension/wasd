import { Proxy } from './proxy/types'
import { Transport, TransportConstructor } from './transport'

export default class NetworkModuleProperties {
    constructor(
        public readonly transports?: ({
            transport: TransportConstructor<Transport>,
            port: number,
        })[],
        public readonly proxies: Proxy[] = [],
    ) {
    }
}
