import './App.css'
import { Canvas } from '@react-three/fiber'
import Game from './Game'
import { useNetwork } from './network'

function App() {
    useNetwork({ url: 'http://localhost:8080' })

    return (
    <Canvas>
       <Game />
    </Canvas>
    )
}

export default App
