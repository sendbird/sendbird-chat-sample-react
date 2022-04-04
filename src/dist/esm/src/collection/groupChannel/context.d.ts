import { GroupChannelEventSource } from '../../comm/command/internal/groupChannelEventCommand';
export default class GroupChannelEventContext {
    readonly source: GroupChannelEventSource;
    /**
     * @private
     */
    constructor(source: GroupChannelEventSource);
}
