import NetworkClient from '../../client/NetworkClient'

class UDPClient extends NetworkClient {
    sendMessage(): void {
        throw new Error('Method not implemented.')
    }

    emit(): void {
        throw new Error('Method not implemented.')
    }
}

export default UDPClient
