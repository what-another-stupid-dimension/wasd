import { createContext } from 'react'
import { NetworkContextData } from './types'

const NetworkContext = createContext<NetworkContextData>({
    bindNetworkEvent: () => {},
    unbindNetworkEvent: () => {},
    isConnected: false,
    socket: null,
    sendNetworkEvent: () => {},
})

export default NetworkContext
