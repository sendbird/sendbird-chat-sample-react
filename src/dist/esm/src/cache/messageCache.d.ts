import InstancedObject from '../model/instancedObject';
import BaseMessage from '../model/message/baseMessage';
import MessageFilter from './messageFilter';
import { MessageListOrder } from '../model/message/messageListOrder';
import TimeRange from '../utils/timeRange';
interface MessageCacheFetchParams {
    channelUrl: string;
    token: number | string;
    limit?: number;
    filter?: MessageFilter;
    order?: MessageListOrder;
    backward?: boolean;
}
/**
 * @internal
 */
export default class MessageCache extends InstancedObject {
    private _sdkState;
    private _cacheContext;
    constructor(_iid: string, { sdkState, cacheContext, }: {
        sdkState: any;
        cacheContext: any;
    });
    private get collection();
    get localCacheEnabled(): boolean;
    private _serialize;
    private _deserialize;
    get(messageId: number): Promise<BaseMessage>;
    fetch({ channelUrl, token, limit, backward, filter, order, }: MessageCacheFetchParams): Promise<BaseMessage[]>;
    upsert(messages: BaseMessage[]): Promise<void>;
    remove(messageIds: number[]): Promise<void>;
    removeChannel(channelUrl: string): Promise<void>;
    clear(): Promise<void>;
    countBetween(channelUrl: string, filter: MessageFilter, range: TimeRange): Promise<number>;
}
export {};
