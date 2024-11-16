import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { NetworkContextData } from './types'

type Props = {
    url: string
}

const useNetwork = ({ url }: Props): NetworkContextData => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        setSocket(io(url))
    }, [url])

    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
        }

        function onDisconnect() {
            setIsConnected(false)
        }

        if (socket !== null) {
            console.log('new socket', socket)
            socket.on('connect', onConnect)
            socket.on('disconnect', onDisconnect)

            return () => {
                console.log('disconnect', socket)
                socket.off('connect', onConnect)
                socket.off('disconnect', onDisconnect)
                socket.close()
            }
        }

        return () => {}
    }, [socket])

    const onNetworkEvent = (event: string, callback: (data: any) => void) => {
        if (socket !== null) {
            socket.on(event, (data: any) => {
                callback(data)
            })
        }
    }

    const sendNetworkEvent = (type: string, data: any) => {
        if (socket !== null) {
            socket.send(JSON.stringify({ type, data }))
        }
    }

    return {
        isConnected,
        socket,
        onNetworkEvent,
        sendNetworkEvent,
    }
}

export default useNetwork
