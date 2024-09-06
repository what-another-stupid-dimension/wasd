import { Socket } from 'net'
import { Transport } from '../types'
import NetworkClient from '../NetworkClient'

class TCPClient<T extends Transport> extends NetworkClient<T> {
    constructor(public socket: Socket, address: string, port: number, public transport: T) {
        super(address, port, transport)
    }
}

export default TCPClient
