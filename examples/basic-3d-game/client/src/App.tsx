import { Canvas } from '@react-three/fiber'
import './App.css'
import Game from './Game'
import { NetworkProvider } from './network'
import { MediaControls, WebRTCProvider } from './webRTC'

function App() {
    return (
        <NetworkProvider url="http://localhost:8080">
            <WebRTCProvider>
                <MediaControls />
                <Canvas style={{ width: '100vw', height: '100vh' }}>
                    <Game />
                </Canvas>
            </WebRTCProvider>
       </NetworkProvider>
    )
}

export default App
