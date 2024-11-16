import { InvalidClientMessageErrorReason } from './types'

const mapReasonToMessage = (reason: InvalidClientMessageErrorReason): string => {
    switch (reason) {
        case InvalidClientMessageErrorReason.InvalidObject:
            return 'Invalid message object'
        case InvalidClientMessageErrorReason.MissingType:
            return 'Missing message type'
        case InvalidClientMessageErrorReason.InvalidType:
            return 'Invalid message type'
        case InvalidClientMessageErrorReason.UnkownEvent:
            return 'Invalid message type, the event name is not registered'
        default:
            return 'Unknown Reason'
    }
}
export default class InvalidClientMessageError extends Error {
    constructor(
        data: any,
        public reason: InvalidClientMessageErrorReason,
    ) {
        super(`${mapReasonToMessage(reason)} (${data.toString()})`)
    }
}
