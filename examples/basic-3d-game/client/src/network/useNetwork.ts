import {
    useContext,
} from 'react'
import { NetworkContextData } from './types'
import NetworkContext from './NetworkContext'

const useNetwork = (): NetworkContextData => useContext(NetworkContext)

export default useNetwork
