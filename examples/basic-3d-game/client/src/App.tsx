import { Canvas } from '@react-three/fiber'
import './App.css'
import Game from './Game'
import { NetworkProvider } from './network'

function App() {
    return (
        <NetworkProvider url="http://localhost:8080">
            <Canvas>
                <Game />
            </Canvas>
       </NetworkProvider>
    )
}

export default App
