import InstancedObject from '../model/instancedObject';
import SendableMessage from '../model/message/sendableMessage';
import MessageFilter from './messageFilter';
import { MessageListOrder } from '../model/message/messageListOrder';
export declare const NESTDB_UNSENT_MESSAGE_COLLECTION_NAME = "UnsentMessage";
export declare const NESTDB_UNSENT_MESSAGE_COLLECTION_KEY = "reqId";
interface UnsentMessageCacheFetchParams {
    channelUrl: string;
    filter?: MessageFilter;
    order?: MessageListOrder;
}
/**
 * @internal
 */
export default class UnsentMessageCache extends InstancedObject {
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
    get(reqId: string): Promise<SendableMessage>;
    fetch({ channelUrl, filter, order, }: UnsentMessageCacheFetchParams): Promise<SendableMessage[]>;
    upsert(messages: SendableMessage[]): Promise<void>;
    remove(reqIds: string[]): Promise<void>;
    removeChannel(channelUrl: string): Promise<void>;
    clear(): Promise<void>;
}
export {};
