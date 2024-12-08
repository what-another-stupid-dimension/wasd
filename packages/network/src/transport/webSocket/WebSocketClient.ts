import { Socket } from 'socket.io'
import NetworkClient from '../../client/NetworkClient'

class WebSocketClient extends NetworkClient {
    public readonly socket: Socket

    constructor(socket: Socket) {
        // Using socket.id as the address and assigning a default port since WebSocket does not have an explicit port per client.
        super(socket.handshake.address || 'unknown', socket.handshake.address ? 80 : 0)
        this.socket = socket
    }

    sendMessage(message: string | ArrayBuffer): void {
        this.socket.send(message)
    }

    emit(event: string, data: any): void {
        this.socket.emit(event, JSON.stringify(data))
    }
}

export default WebSocketClient
