import { NetworkClient } from '../client'
import { NetworkEvent } from '../events'

export interface Proxy {
    apply(event: NetworkEvent, client: NetworkClient): Promise<NetworkEvent | false>
    accepts(event: NetworkEvent): boolean
}
