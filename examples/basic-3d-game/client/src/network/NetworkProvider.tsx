/* eslint-disable max-lines-per-function */
import {
    FC, PropsWithChildren, useEffect, useRef, useState,
} from 'react'
import { io, Socket } from 'socket.io-client'
import NetworkContext from './NetworkContext'

type Props = {
    url: string
}

const NetworkProvider: FC<PropsWithChildren<Props>> = ({ url, children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const eventHandlers = useRef<Map<(data: any) => void, (data: any) => void>>(new Map())

    useEffect(() => {
        const newSocket = io(url)
        setSocket(newSocket)

        return () => {
            newSocket.close()
            setSocket(null)
        }
    }, [url])

    useEffect(() => {
        if (socket) {
            const onConnect = () => setIsConnected(true)
            const onDisconnect = () => setIsConnected(false)

            socket.on('connect', onConnect)
            socket.on('disconnect', onDisconnect)

            return () => {
                socket.off('connect', onConnect)
                socket.off('disconnect', onDisconnect)
            }
        }

        return () => {}
    }, [socket])

    const bindNetworkEvent = (event: string, callback: (data: any) => void) => {
        if (socket) {
            const wrappedCallback = (data: any) => callback(JSON.parse(data))
            eventHandlers.current.set(callback, wrappedCallback)
            socket.on(event, wrappedCallback)
        }
    }

    const unbindNetworkEvent = (event: string, callback: (data: any) => void) => {
        if (socket) {
            const wrappedCallback = eventHandlers.current.get(callback)
            if (wrappedCallback) {
                socket.off(event, wrappedCallback)
                eventHandlers.current.delete(callback)
            }
        }
    }

    const sendNetworkEvent = (event: { serialize: () => string }) => {
        if (socket) {
            socket.send(JSON.stringify({ type: event.constructor.name, data: event.serialize() }))
        }
    }

    return (
        <NetworkContext.Provider value={{
            isConnected,
            socket,
            bindNetworkEvent,
            unbindNetworkEvent,
            sendNetworkEvent,
        }}>
            {children}
        </NetworkContext.Provider>
    )
}

export default NetworkProvider
