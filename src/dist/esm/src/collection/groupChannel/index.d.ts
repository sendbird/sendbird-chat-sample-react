import GroupChannelEventContext from './context';
import BaseChannel from '../../model/channel/baseChannel';
import GroupChannel from '../../model/channel/groupChannel';
import { GroupChannelListOrder } from '../../model/channel/groupChannelListOrder';
import GroupChannelFilter from '../../cache/groupChannelFilter';
export interface GroupChannelCollectionParams {
    filter?: GroupChannelFilter;
    order?: GroupChannelListOrder;
    limit?: number;
}
export interface GroupChannelCollectionEventHandler {
    onChannelsAdded: (context: GroupChannelEventContext, channels: BaseChannel[]) => void;
    onChannelsUpdated: (context: GroupChannelEventContext, channels: BaseChannel[]) => void;
    onChannelsDeleted: (context: GroupChannelEventContext, channelUrls: string[]) => void;
}
export default class GroupChannelCollection {
    readonly channels: GroupChannel[];
    readonly filter: GroupChannelFilter;
    readonly order: GroupChannelListOrder;
    private _hasMore;
    private _token;
    private _limit;
    private _iid;
    private _key;
    private _handler;
    /**
     * @private
     */
    constructor(_iid: string, { filter, order, limit, }: GroupChannelCollectionParams);
    get hasMore(): boolean;
    setEventHandler(handler: GroupChannelCollectionEventHandler): void;
    private _addChannelsToView;
    private _removeChannelsFromView;
    private _getLocalChannels;
    private _getRemoteChannels;
    loadMore(): Promise<GroupChannel[]>;
    dispose(): void;
}
