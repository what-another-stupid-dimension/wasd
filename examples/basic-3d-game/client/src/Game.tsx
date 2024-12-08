import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { EntityManager } from './entity'
import { useControls } from './controls'
import { useStateCamera } from './camera'
import { useWebRTC } from './webRTC'

const Game = () => {
    const { camera, gl } = useThree()
    useControls()
    useStateCamera({ })
    useWebRTC()

    useEffect(() => {
        gl.shadowMap.enabled = true
        gl.shadowMap.autoUpdate = true
        camera.position.set(0, -10, 20)
        camera.lookAt(0, 0, 0)
    }, [camera, gl])

    return (
    <>
      {/* Main directional light casting shadows */}
      <directionalLight
        castShadow
        position={[0, 10, 5]}
        intensity={5}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />

      {/* Low-intensity ambient light to enhance shadow contrast */}
      <ambientLight intensity={0.8} />

      <EntityManager />
    </>
    )
}

export default Game
