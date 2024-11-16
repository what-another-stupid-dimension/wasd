import { NetworkEvent, NetworkEventConstructor } from '@wasd/network'
import { useContext } from 'react'
import NetworkContext from './NetworkContext'

const useNetworkEvent = <T extends NetworkEvent>(
    eventConstructor: NetworkEventConstructor<T>,
): ((event: T) => void) => {
    const { sendNetworkEvent } = useContext(NetworkContext)
    return (event: T) => {
        sendNetworkEvent(eventConstructor.eventName, event.serialize())
    }
}

export default useNetworkEvent
