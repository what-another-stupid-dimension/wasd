export default class WebRTCAnswerEvent {
    static readonly name = 'webrtc:answer'

    constructor(
        public readonly sdp: string,
        public readonly type: 'answer',
        public readonly senderId: string,
    ) {}

    serialize() {
        return { sdp: this.sdp, type: this.type, senderId: this.senderId }
    }

    static deserialize(data: unknown): WebRTCAnswerEvent {
        if (
            !data
            || typeof (data as any).sdp !== 'string'
            || (data as any).type !== 'answer'
            || typeof (data as any).senderId !== 'string'
        ) {
            throw new Error('Invalid data for WebRTCAnswerEvent')
        }
        return new WebRTCAnswerEvent((data as any).sdp, (data as any).type, (data as any).senderId)
    }
}
