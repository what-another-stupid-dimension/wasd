import { Socket } from 'socket.io'
import NetworkClient from '../../client/NetworkClient'

class WebSocketClient extends NetworkClient {
    public readonly socket: Socket

    constructor(socket: Socket) {
        // Using socket.id as the address and assigning a default port since WebSocket does not have an explicit port per client.
        super(socket.handshake.address || 'unknown', socket.handshake.address ? 80 : 0)
        this.socket = socket
    }

    // Additional helper method if needed
    send(data: string): void {
        this.socket.send(data)
    }
}

export default WebSocketClient
