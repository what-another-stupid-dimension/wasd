import { Event } from '@wasd/events'
import { NetworkClient, Transport } from '../transport'

abstract class NetworkEvent implements Event {
    constructor(public client: NetworkClient<Transport>) {}
}

export default NetworkEvent
