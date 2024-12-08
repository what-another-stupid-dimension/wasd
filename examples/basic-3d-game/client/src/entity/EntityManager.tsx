/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react'
import { Vector3 } from 'three'
import Entity from './Entity'
import { useNetwork } from '../network'

const EntityManager = () => {
    const { bindNetworkEvent, unbindNetworkEvent } = useNetwork()
    const [state, setState] = useState<any>({})

    useEffect(() => {
        const onInitialState = (data: any) => {
            const newState: { [key: string]: any } = {}
            data.state.forEach((entity: { id: string }) => {
                newState[entity.id] = entity
            })
            setState(newState)
        }
        const onStateUpdate = (data: any) => {
            try {
                setState((prevState: { [key: string]: any }) => {
                    const newState = { ...prevState }
                    data.updated?.forEach((entity: { id: string }) => {
                        newState[entity.id] = entity
                    })
                    data.added?.forEach((entity: { id: string }) => {
                        newState[entity.id] = entity
                    })
                    data.removed?.forEach((id: string) => {
                        delete newState[id]
                    })
                    return newState
                })
            } catch (error) {
                console.error('Error processing state update:', error)
            }
        }

        bindNetworkEvent('stateUpdate', onStateUpdate)
        bindNetworkEvent('initialState', onInitialState)
        return () => {
            unbindNetworkEvent('stateUpdate', onStateUpdate)
            bindNetworkEvent('initialState', onInitialState)
        }
    }, [bindNetworkEvent, unbindNetworkEvent])

    return (
    <>
      {Object.keys(state).map((key) => (
         <Entity
            key={key}
            id={state[key].id}
            serverPosition={state[key].position}
            model={state[key].model}
            velocity={new Vector3(...state[key].velocity)}
            name={state[key].name}
        />
      ))}

    </>
    )
}

export default EntityManager
