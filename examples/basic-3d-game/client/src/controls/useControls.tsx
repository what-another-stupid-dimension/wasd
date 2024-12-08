/* eslint-disable no-undef */
/* eslint-disable max-lines-per-function */
import { useState, useEffect } from 'react'
import { PlayerEvents } from '@shared/events'
import { useNetwork } from '../network'

const useControls = () => {
    const { sendNetworkEvent } = useNetwork()
    const [controls, setControls] = useState({
        up: false,
        right: false,
        down: false,
        left: false,
    })

    const updateControls = (newControls: Partial<typeof controls>) => {
        setControls((prevControls) => {
            const updatedControls = { ...prevControls, ...newControls }
            if (JSON.stringify(prevControls) !== JSON.stringify(updatedControls)) {
                sendNetworkEvent?.(new PlayerEvents.SetPlayerControlsNetworkEvent(updatedControls))
            }
            return updatedControls
        })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                updateControls({ up: true })
                break
            case 's':
            case 'ArrowDown':
                updateControls({ down: true })
                break
            case 'a':
            case 'ArrowLeft':
                updateControls({ left: true })
                break
            case 'd':
            case 'ArrowRight':
                updateControls({ right: true })
                break
            default:
                break
        }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                updateControls({ up: false })
                break
            case 's':
            case 'ArrowDown':
                updateControls({ down: false })
                break
            case 'a':
            case 'ArrowLeft':
                updateControls({ left: false })
                break
            case 'd':
            case 'ArrowRight':
                updateControls({ right: false })
                break
            default:
                break
        }
    }

    useEffect(() => {
        if (!sendNetworkEvent) {
            console.warn('sendNetworkEvent is not initialized')
            return () => {}
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [sendNetworkEvent]) // Dependency on sendNetworkEvent to ensure it's available

    return controls
}

export default useControls
