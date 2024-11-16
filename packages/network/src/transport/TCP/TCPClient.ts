import { Socket } from 'net'
import NetworkClient from '../../client/NetworkClient'

class TCPClient extends NetworkClient {
    constructor(public socket: Socket, address: string, port: number) {
        super(address, port)
    }
}

export default TCPClient
