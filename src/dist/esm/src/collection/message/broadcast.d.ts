import MessageCache from '../../cache/messageCache';
import UnsentMessageCache from '../../cache/unsentMessageCache';
import { CommandDispatcher } from '../../core/eventDispatcher';
import { MessageEventSource } from '../../comm/command/internal/messageEventCommand';
import BaseMessage from '../../model/message/baseMessage';
interface MessageBroadcastParams {
    messageCache: MessageCache;
    unsentMessageCache: UnsentMessageCache;
    dispatcher: CommandDispatcher;
}
/**
 * @internal
 */
export interface MessageEventObserver {
    onUpdate: (messages: BaseMessage[], source: MessageEventSource) => void;
    onRemove: (messageIds: number[], source: MessageEventSource) => void;
    onRemoveUnsent: (reqId: string, source: MessageEventSource) => void;
}
/**
 * @internal
 */
export default class MessageBroadcast {
    private _observers;
    constructor({ messageCache, unsentMessageCache, dispatcher }: MessageBroadcastParams);
    private _broadcastUpdateEvent;
    private _broadcastRemoveEvent;
    private _broadcastRemoveUnsentEvent;
    subscribe(key: string, observer: MessageEventObserver): void;
    unsubscribe(key: string): void;
}
export {};
