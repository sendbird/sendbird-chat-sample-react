import GroupChannelCache from '../../cache/groupChannelCache';
import MessageCache from '../../cache/messageCache';
import UnsentMessageCache from '../../cache/unsentMessageCache';
import { CommandDispatcher } from '../../core/eventDispatcher';
import { GroupChannelEventSource } from '../../comm/command/internal/groupChannelEventCommand';
import GroupChannel from '../../model/channel/groupChannel';
interface GroupChannelBroadcastParams {
    groupChannelCache: GroupChannelCache;
    messageCache: MessageCache;
    unsentMessageCache: UnsentMessageCache;
    dispatcher: CommandDispatcher;
}
/**
 * @internal
 */
export interface GroupChannelEventObserver {
    onUpdate: (channels: GroupChannel[], source: GroupChannelEventSource) => void;
    onRemove: (channelUrls: string[], source: GroupChannelEventSource) => void;
}
/**
 * @internal
 */
export default class GroupChannelBroadcast {
    private _observers;
    constructor({ groupChannelCache, messageCache, unsentMessageCache, dispatcher, }: GroupChannelBroadcastParams);
    private _broadcastUpdateEvent;
    private _broadcastRemoveEvent;
    subscribe(key: string, observer: GroupChannelEventObserver): void;
    unsubscribe(key: string): void;
}
export {};
