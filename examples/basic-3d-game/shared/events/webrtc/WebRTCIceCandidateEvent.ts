export default class WebRTCIceCandidateEvent {
    static readonly name = 'webrtc:iceCandidate'

    constructor(
        public readonly candidate: RTCIceCandidateInit,
        public readonly senderId: string,
    ) {}

    serialize() {
        return { candidate: this.candidate, senderId: this.senderId }
    }

    static deserialize(data: unknown): WebRTCIceCandidateEvent {
        if (!data || typeof (data as any).candidate !== 'object' || typeof (data as any).senderId !== 'string') {
            throw new Error('Invalid data for WebRTCIceCandidateEvent')
        }
        // eslint-disable-next-line max-len
        return new WebRTCIceCandidateEvent((data as any).candidate as RTCIceCandidateInit, (data as any).senderId)
    }
}
