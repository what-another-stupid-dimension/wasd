import { createContext } from 'react'
import { NetworkContextData } from './types'

const NetworkContext = createContext<NetworkContextData>({
    onNetworkEvent: () => {},
})

export default NetworkContext
