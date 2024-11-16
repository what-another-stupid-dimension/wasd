import net from 'net'
import { Transport, TransportCallbacks } from '../types'
import TCPClient from './TCPClient'
import { TCPSocketErrorCode } from './types'

class TCPTransport implements Transport {
    private server: net.Server

    private clients = new Map<string, TCPClient>()

    constructor(
        private port: number,
        private callbacks: TransportCallbacks,
    ) {
        this.server = net.createServer((socket) => {
            if (!socket.remoteAddress) {
                this.callbacks.onClientError('Invalid client connection address')
                return
            }

            if (!socket.remotePort) {
                this.callbacks.onClientError('Invalid client connection port')
                return
            }

            const client = new TCPClient(
                socket,
                socket.remoteAddress,
                socket.remotePort,
            )
            this.clients.set(client.getIdentifier(), client)
            this.callbacks.onClientConnected(client)

            socket.on('close', () => {
                this.clients.delete(client.getIdentifier())
                this.callbacks.onClientDisconnected(client)
            })

            socket.on('error', (err: {code: TCPSocketErrorCode}) => {
                switch (err.code || '') {
                    case TCPSocketErrorCode.ConnectionReset:
                        this.callbacks.onClientDisconnected(client)
                        break
                    default:
                        this.callbacks.onClientError(`Error with client ${client.getIdentifier()}: ${err}`)
                        break
                }
            })

            socket.on('data', (data) => {
                this.callbacks.onClientMessage(client, data.toString())
            })
        })
    }

    open(): void {
        this.server.listen(this.port, () => {
            this.callbacks.onOpen(this.constructor.name, this.port)
        })
    }

    close(): void {
        Array.from(this.clients.values()).forEach((client) => {
            client.socket.destroy()
            this.callbacks.onClientDisconnected(client)
        })
        this.clients.clear()
        this.server.close()
        this.callbacks.onClose(this.constructor.name, this.port)
    }
}

export default TCPTransport
