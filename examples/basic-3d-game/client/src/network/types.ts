import { Socket } from 'socket.io-client'

export type NetworkContextData = {
    onNetworkEvent: (event: string, callback: (data: any) => void) => void
    sendNetworkEvent: (type: string, data: any) => void
    isConnected: boolean,
    socket: Socket | null,
}
