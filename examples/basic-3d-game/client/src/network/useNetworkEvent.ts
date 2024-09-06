import { useEffect } from 'react'
import { SharedNetworkEvent } from '../../../shared/src'

type SharedEventConstructor<T extends SharedNetworkEvent> = {
    new (...args: any[]): T
    eventName: string
}
const useNetworkEvent = <T extends SharedNetworkEvent>(
    eventConstructor: SharedEventConstructor<T>,
    handler: (event: T) => void,
) => {
    useEffect(() => {
        console.log(eventConstructor.eventName, handler)
    }, [])
}

export default useNetworkEvent
