import { Socket } from 'net'
import NetworkClient from '../../client/NetworkClient'

class TCPClient extends NetworkClient {
    constructor(public socket: Socket, address: string, port: number) {
        super(address, port)
    }

    sendMessage(message: string): void {
        this.socket.write(message)
    }

    emit(event: string, data: any): void {
        this.socket.emit(event, JSON.stringify(data))
    }
}

export default TCPClient
