import './App.css'
import { Canvas } from '@react-three/fiber'
import Game from './Game'
import { NetworkProvider } from './network'

function App() {
    return (
    <Canvas>
        <NetworkProvider url="http://localhost:8080">
             <Game />
       </NetworkProvider>
    </Canvas>
    )
}

export default App
