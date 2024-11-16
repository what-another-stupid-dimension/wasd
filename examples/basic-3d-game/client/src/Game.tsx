import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { TestEvent } from '@shared/events'
import { Plane } from '@react-three/drei'
import Box from './shapes/Box'
import { useNetworkEvent } from './network'

const Game = () => {
    const { camera, gl } = useThree()

    const send = useNetworkEvent(TestEvent)

    useEffect(() => {
        gl.shadowMap.enabled = true
        gl.shadowMap.autoUpdate = true
        camera.position.set(0, -10, 20)
        camera.lookAt(0, 0, 0)
    }, [camera, gl])

    useEffect(() => {
        send(new TestEvent('world'))
    }, [send])

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

      {/* Boxes that cast shadows */}
      <Box position={[0, 0, 2]} castShadow />

      {/* Plane that receives shadows with high contrast */}
      <Plane args={[100, 100]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial
          color="#ffffff"
          emissive={'#ffffff'}
          emissiveIntensity={35}
          roughness={1}
          metalness={0.1}
        />
      </Plane>
    </>
    )
}

export default Game
