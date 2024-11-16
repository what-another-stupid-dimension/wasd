import { createContext } from 'react'
import { NetworkContextData } from './types'

const NetworkContext = createContext<NetworkContextData>({
    onNetworkEvent: () => {},
    isConnected: false,
    socket: null,
    sendNetworkEvent: () => {},
})

export default NetworkContext
