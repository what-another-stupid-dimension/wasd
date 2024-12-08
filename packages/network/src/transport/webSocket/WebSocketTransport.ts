import { Server as SocketIOServer, Socket } from 'socket.io'
import { Transport, TransportCallbacks } from '../types'
import WebSocketClient from './WebSocketClient'

class WebSocketTransport implements Transport {
    private server: SocketIOServer

    private clients = new Map<string, WebSocketClient>()

    constructor(
        private port: number,
        private callbacks: TransportCallbacks,
    ) {
        this.server = new SocketIOServer({
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        })

        this.server.on('connection', (socket: Socket) => {
            const client = new WebSocketClient(socket)

            this.clients.set(client.getIdentifier(), client)
            this.callbacks.onClientConnected(client)

            socket.on('disconnect', () => {
                this.clients.delete(client.getIdentifier())
                this.callbacks.onClientDisconnected(client)
            })

            socket.on('error', (err: Error) => this.handleSocketError(err, client))

            socket.on('message', (data: string) => {
                this.callbacks.onClientMessage(client, data)
            })
        })
    }

    open(): void {
        this.server.listen(this.port) // Start listening on the specified port
        this.callbacks.onOpen(this.constructor.name, this.port)
    }

    close(): void {
        Array.from(this.clients.values()).forEach((client) => {
            client.socket.disconnect()
            this.callbacks.onClientDisconnected(client)
        })
        this.clients.clear()
        this.server.close(() => {
            this.callbacks.onClose(this.constructor.name, this.port)
        })
    }

    broadcast(message: string): void {
        this.clients.forEach((client) => {
            client.sendMessage(message)
        })
    }

    private handleSocketError(err: Error, client: WebSocketClient): void {
        if (err.message.includes('disconnect')) {
            // Handle disconnect-specific errors
            this.callbacks.onClientDisconnected(client)
        } else {
            // For other errors, log and call the error callback
            this.callbacks.onClientError(`Error with client ${client.getIdentifier()}: ${err.message}`)
        }
    }
}

export default WebSocketTransport
