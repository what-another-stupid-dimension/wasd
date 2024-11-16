import { FC, PropsWithChildren } from 'react'
import NetworkContext from './NetworkContext'
import useNetwork from './useNetwork'

type Props = {
    url: string
}

const NetworkProvider: FC<PropsWithChildren<Props>> = ({ url, children }) => {
    const value = useNetwork({ url })

    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    )
}

export default NetworkProvider
