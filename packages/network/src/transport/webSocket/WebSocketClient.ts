import { Socket } from 'socket.io'
import NetworkClient from '../NetworkClient'

class WebSocketClient<T> extends NetworkClient<T> {
    public readonly socket: Socket

    constructor(socket: Socket, transport: T) {
        // Using socket.id as the address and assigning a default port since WebSocket does not have an explicit port per client.
        super(socket.handshake.address || 'unknown', socket.handshake.address ? 80 : 0, transport)
        this.socket = socket
    }

    // Additional helper method if needed
    send(data: string): void {
        this.socket.send(data)
    }
}

export default WebSocketClient
