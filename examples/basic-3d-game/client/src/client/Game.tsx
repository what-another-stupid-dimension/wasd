import { useEffect } from 'react'
import { SpotLight } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Box from '../shapes/Box'

const Game = () => {
    const { camera } = useThree()

    useEffect(() => {
        camera.position.set(5, 5, 5)
        camera.lookAt(0, 0, 0)
    }, [])

    return (
    <>
      <ambientLight />
      <ambientLight intensity={Math.PI / 2} />
      <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </>

    )
}

export default Game
