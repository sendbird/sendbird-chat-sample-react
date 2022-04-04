import { MessageEventSource } from '../../comm/command/internal/messageEventCommand';
export default class MessageEventContext {
    readonly source: MessageEventSource;
    /**
     * @private
     */
    constructor(source: MessageEventSource);
}
