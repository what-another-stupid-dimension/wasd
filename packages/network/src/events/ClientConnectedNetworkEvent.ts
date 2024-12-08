import { NetworkClient } from '../client'

class ClientConnectedNetworkEvent {
    constructor(
        public client: NetworkClient,
    ) {
    }
}
export default ClientConnectedNetworkEvent
