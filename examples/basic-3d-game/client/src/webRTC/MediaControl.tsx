import React, { useState, useCallback } from 'react'
import { useWebRTC } from './WebRTCContext'

export const MediaControls: React.FC = () => {
    const {
        toggleMute,
        toggleVideo,
        shareScreen,
        stopScreenShare,
        isScreenSharing,
    } = useWebRTC()

    const [isMuted, setIsMuted] = useState(false)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)

    const handleMuteToggle = useCallback(() => {
        toggleMute()
        setIsMuted((prev) => !prev)
    }, [toggleMute])

    const handleVideoToggle = useCallback(() => {
        toggleVideo()
        setIsVideoEnabled((prev) => !prev)
    }, [toggleVideo])

    const handleScreenShareToggle = useCallback(() => {
        if (isScreenSharing) {
            stopScreenShare()
        } else {
            shareScreen()
        }
    }, [isScreenSharing, shareScreen, stopScreenShare])

    return (
        <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            {/* Mute/Unmute Audio */}
            <button onClick={handleMuteToggle}>
                {isMuted ? 'Unmute Audio' : 'Mute Audio'}
            </button>

            {/* Enable/Disable Video */}
            <button onClick={handleVideoToggle}>
                {isVideoEnabled ? 'Disable Video' : 'Enable Video'}
            </button>

            {/* Share/Stop Screen */}
            <button onClick={handleScreenShareToggle}>
                {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </button>
        </div>
    )
}

export default MediaControls
