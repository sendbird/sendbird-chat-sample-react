import SendbirdChat from '../sendbird';
import Module from './baseModule';
import { FileCompat } from '../types';
import GroupChannel, { CountPreference, HiddenState, MutedState, UnreadItemKey } from '../model/channel/groupChannel';
import GroupChannelChangelogs from '../model/channel/groupChannelChangelogs';
import Member, { MemberState } from '../model/channel/member';
import ReadStatus from '../model/channel/readStatus';
import { GroupChannelListOrder, PublicGroupChannelListOrder } from '../model/channel/groupChannelListOrder';
import GroupChannelCollection, { GroupChannelCollectionEventHandler, GroupChannelCollectionParams } from '../collection/groupChannel';
import GroupChannelFilter from '../cache/groupChannelFilter';
import MessageCollection, { MessageCollectionEventHandler, MessageCollectionInitHandler, MessageCollectionInitPolicy } from '../collection/message';
import MessageFilter from '../cache/messageFilter';
import GroupChannelHandler from '../model/handler/groupChannelHandler';
import { GroupChannelSearchField, GroupChannelSearchFilter, GroupChannelUserIdsFilter, HiddenChannelFilter, MemberStateFilter, OperatorFilter, PublicChannelFilter, QueryType, SuperChannelFilter, UnreadChannelFilter } from '../model/channel/groupChannelFilter';
import GroupChannelCreateParams from '../model/params/groupChannelCreateParams';
import GroupChannelCountParams from '../model/params/groupChannelCountParams';
import GroupChannelChangeLogsParams from '../model/params/groupChannelChangeLogsParams';
import GroupChannelHideParams from '../model/params/groupChannelHideParams';
import GroupChannelUpdateParams from '../model/params/groupChannelUpdateParams';
import GroupChannelListQuery, { GroupChannelListQueryParams } from '../query/groupChannelListQuery';
import PublicGroupChannelListQuery, { PublicGroupChannelListQueryParams } from '../query/publicGroupChannelListQuery';
import MemberListQuery, { MemberListOrder } from '../query/memberListQuery';
import GroupChannelEventContext from '../collection/groupChannel/context';
import MessageEventContext from '../collection/message/context';
import { GroupChannelEventSource } from '../comm/command/internal/groupChannelEventCommand';
import { MessageEventSource } from '../comm/command/internal/messageEventCommand';
declare class GroupChannelModule extends Module {
    name: 'groupChannel';
    private _manager;
    /**
     * @internal
     */
    init(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    }): void;
    createGroupChannelCollection(params?: GroupChannelCollectionParams): GroupChannelCollection;
    createMyGroupChannelListQuery(params?: GroupChannelListQueryParams): GroupChannelListQuery;
    createPublicGroupChannelListQuery(params?: PublicGroupChannelListQueryParams): PublicGroupChannelListQuery;
    addGroupChannelHandler(key: string, handler: GroupChannelHandler): void;
    removeGroupChannelHandler(key: string): void;
    removeAllGroupChannelHandlers(): void;
    buildGroupChannelFromSerializedData(serialized: object): GroupChannel;
    buildGroupChannelListQueryFromSerializedData(serialized: object): GroupChannelListQuery;
    buildMemberFromSerializedData(serialized: object): Member;
    getChannel(channelUrl: string): Promise<GroupChannel>;
    getChannelWithoutCache(channelUrl: string): Promise<GroupChannel>;
    getMyGroupChannelChangeLogsByToken(token: string, params: GroupChannelChangeLogsParams): Promise<GroupChannelChangelogs>;
    getMyGroupChannelChangeLogsByTimestamp(ts: number, params: GroupChannelChangeLogsParams): Promise<GroupChannelChangelogs>;
    getGroupChannelCount(params: GroupChannelCountParams): Promise<number>;
    createChannel(params: GroupChannelCreateParams): Promise<GroupChannel>;
    createDistinctChannelIfNotExist(params: GroupChannelCreateParams): Promise<GroupChannel>;
    createChannelWithUserIds(userIds: string[], isDistinct?: boolean, name?: string, coverUrlOrImageFile?: string | FileCompat, data?: string, customType?: string): Promise<GroupChannel>;
    markAsReadAll(): Promise<void>;
    markAsReadWithChannelUrls(channelUrls: string[]): Promise<void>;
    markAsDelivered(channelUrl: string): Promise<void>;
}
declare type SendbirdGroupChat = SendbirdChat & {
    groupChannel: GroupChannelModule;
};
export { CountPreference, GroupChannelModule, GroupChannel, GroupChannelChangelogs, GroupChannelChangeLogsParams, GroupChannelCreateParams, GroupChannelCollection, GroupChannelCollectionEventHandler, GroupChannelCountParams, GroupChannelEventContext, GroupChannelEventSource, GroupChannelFilter, GroupChannelHandler, GroupChannelHideParams, GroupChannelListOrder, GroupChannelListQuery, GroupChannelSearchField, GroupChannelSearchFilter, GroupChannelUpdateParams, GroupChannelUserIdsFilter, HiddenChannelFilter, HiddenState, Member, MemberListOrder, MemberListQuery, MemberState, MemberStateFilter, MessageCollection, MessageCollectionEventHandler, MessageCollectionInitHandler, MessageCollectionInitPolicy, MessageEventContext, MessageEventSource, MessageFilter, MutedState, OperatorFilter, PublicChannelFilter, PublicGroupChannelListOrder, PublicGroupChannelListQuery, QueryType, ReadStatus, SendbirdGroupChat, SuperChannelFilter, UnreadChannelFilter, UnreadItemKey, };
