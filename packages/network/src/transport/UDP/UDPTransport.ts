import dgram from 'dgram'
import { Transport, TransportCallbacks } from '../types'
import UDPClient from './UDPClient'

class UDPTransport implements Transport {
    private server: dgram.Socket

    private clients = new Map<string, UDPClient>()

    constructor(
        private port: number,
        private callbacks: TransportCallbacks,
    ) {
        this.port = port

        this.server = dgram.createSocket('udp4')

        this.server.on('error', (err) => {
            this.callbacks.onError(err)
        })

        this.server.on('message', (msg, rinfo) => {
            const clientId = `${rinfo.address}:${rinfo.port}`
            let client = this.clients.get(clientId)
            if (!client) {
                client = new UDPClient(rinfo.address, rinfo.port)

                this.clients.set(client.getIdentifier(), client)
                this.callbacks.onClientConnected(client)
            }

            this.callbacks.onClientMessage(client, msg.toString())
        })

        this.server.on('close', () => {
            Array.from(this.clients.values()).forEach((client) => {
                this.callbacks.onClientDisconnected(client)
            })
            this.clients.clear()
        })
    }

    open(): void {
        this.server.bind(this.port, () => {
            this.callbacks.onOpen(this.constructor.name, this.port)
        })
    }

    close(): void {
        this.server.close()
        this.callbacks.onClose(this.constructor.name, this.port)
    }

    broadcast(message: string): void {
        this.clients.forEach((client) => {
            this.server.send(message, client.port, client.address)
        })
    }
}

export default UDPTransport
