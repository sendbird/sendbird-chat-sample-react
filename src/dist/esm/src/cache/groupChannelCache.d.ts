import InstancedObject from '../model/instancedObject';
import GroupChannel from '../model/channel/groupChannel';
import { GroupChannelListOrder } from '../model/channel/groupChannelListOrder';
import GroupChannelFilter from './groupChannelFilter';
interface GroupChannelCacheFetchParams {
    token: number | string;
    limit?: number;
    filter?: GroupChannelFilter;
    order?: GroupChannelListOrder;
    backward?: boolean;
}
/**
 * @internal
 */
export default class GroupChannelCache extends InstancedObject {
    private _sdkState;
    private _cacheContext;
    private _channels;
    constructor(_iid: string, { sdkState, cacheContext, }: {
        sdkState: any;
        cacheContext: any;
    });
    private get collection();
    get localCacheEnabled(): boolean;
    private _serialize;
    private _deserialize;
    get channels(): GroupChannel[];
    isCachedInMemory(channelUrl: string): boolean;
    get(channelUrl: string): Promise<GroupChannel>;
    fetch({ token, limit, backward, filter, order, }: GroupChannelCacheFetchParams): Promise<GroupChannel[]>;
    upsert(channels: GroupChannel[]): Promise<void>;
    remove(channelUrls: string[]): Promise<void>;
    clear(): Promise<void>;
    clearMemoryCache(): void;
    private _setBlockStateOfAllChannels;
    block(blockerId: string, blockeeId: string): Promise<void>;
    unblock(blockerId: string, blockeeId: string): Promise<void>;
    markAsRead(ts: number, channelUrls?: string[]): Promise<void>;
}
export {};
