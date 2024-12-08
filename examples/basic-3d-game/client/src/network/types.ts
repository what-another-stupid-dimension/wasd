import { Socket } from 'socket.io-client'

export type NetworkContextData = {
    bindNetworkEvent: (event: string, callback: (data: any) => void) => void
    unbindNetworkEvent: (event: string, callback: (data: any) => void) => void
    sendNetworkEvent: (event: { serialize: () => any }) => void
    isConnected: boolean,
    socket: Socket | null,
}
