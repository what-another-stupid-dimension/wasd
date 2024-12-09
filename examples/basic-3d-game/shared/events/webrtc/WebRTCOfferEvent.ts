export default class WebRTCOfferEvent {
    static readonly name = 'webrtc:offer'

    constructor(
        public readonly sdp: string,
        public readonly type: 'offer',
        public readonly senderId: string,
    ) {}

    serialize() {
        return { sdp: this.sdp, type: this.type, senderId: this.senderId }
    }

    static deserialize(data: unknown): WebRTCOfferEvent {
        if (
            !data
            || typeof (data as any).sdp !== 'string'
            || (data as any).type !== 'offer'
            || typeof (data as any).senderId !== 'string'
        ) {
            throw new Error('Invalid data for WebRTCOfferEvent')
        }
        return new WebRTCOfferEvent((data as any).sdp, (data as any).type, (data as any).senderId)
    }
}
