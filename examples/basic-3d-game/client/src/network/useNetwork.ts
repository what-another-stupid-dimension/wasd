import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type Props = {
    url: string
}
const useNetwork = ({ url }: Props) => {
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
            socket.send('hello')

            return () => {
                console.log('disconnect', socket)
                socket.off('connect', onConnect)
                socket.off('disconnect', onDisconnect)
                socket.close()
            }
        }

        return () => {}
    }, [socket])

    return {
        isConnected,
        socket,
    }
}

export default useNetwork
