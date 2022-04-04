import { PushTriggerOption } from '../../types';
import User, { UserPayload } from '../user';
import Member, { MemberPayload, MemberState } from './member';
import ReadStatus from './readStatus';
import { Role } from './types';
import BaseChannel, { BaseChannelPayload } from './baseChannel';
import BaseMessage from '../message/baseMessage';
import SendableMessage from '../message/sendableMessage';
import { UserMessagePayload } from '../message/userMessage';
import { FileMessagePayload } from '../message/fileMessage';
import { AdminMessagePayload } from '../message/adminMessage';
import ScheduledUserMessage from '../message/scheduledUserMessage';
import MessageRequestHandler from '../message/messageRequestHandler';
import MessageCollection, { MessageCollectionParams } from '../../collection/message';
import UserMessageParams from '../params/userMessageParams';
import FileMessageParams from '../params/fileMessageParams';
import ScheduledUserMessageParams from '../params/scheduledUserMessageParams';
import GroupChannelUpdateParams from '../params/groupChannelUpdateParams';
import GroupChannelHideParams from '../params/groupChannelHideParams';
import MemberListQuery, { MemberListQueryParams } from '../../query/memberListQuery';
export declare enum CountPreference {
    ALL = "all",
    UNREAD_MESSAGE_COUNT_ONLY = "unread_message_count_only",
    UNREAD_MENTION_COUNT_ONLY = "unread_mention_count_only",
    OFF = "off"
}
export declare enum MutedState {
    MUTED = "muted",
    UNMUTED = "unmuted"
}
export declare enum HiddenState {
    UNHIDDEN = "unhidden",
    HIDDEN_ALLOW_AUTO_UNHIDE = "hidden_allow_auto_unhide",
    HIDDEN_PREVENT_AUTO_UNHIDE = "hidden_prevent_auto_unhide"
}
export declare enum UnreadItemKey {
    GROUP_CHANNEL_UNREAD_MENTION_COUNT = "group_channel_unread_mention_count",
    NONSUPER_UNREAD_MENTION_COUNT = "non_super_group_channel_unread_mention_count",
    SUPER_UNREAD_MENTION_COUNT = "super_group_channel_unread_mention_count",
    GROUP_CHANNEL_UNREAD_MESSAGE_COUNT = "group_channel_unread_message_count",
    NONSUPER_UNREAD_MESSAGE_COUNT = "non_super_group_channel_unread_message_count",
    SUPER_UNREAD_MESSAGE_COUNT = "super_group_channel_unread_message_count",
    GROUP_CHANNEL_INVITATION_COUNT = "group_channel_invitation_count",
    NONSUPER_INVITATION_COUNT = "non_super_group_channel_invitation_count",
    SUPER_INVITATION_COUNT = "super_group_channel_invitation_count"
}
/**
 * @internal
 */
export interface GroupChannelPayload extends BaseChannelPayload {
    'is_access_code_required'?: boolean;
    'is_distinct'?: boolean;
    'is_super'?: boolean;
    'is_broadcast'?: boolean;
    'is_public'?: boolean;
    'is_discoverable'?: boolean;
    'is_muted'?: string | boolean;
    'is_push_enabled'?: boolean;
    'unread_message_count'?: number;
    'unread_mention_count'?: number;
    'push_trigger_option'?: string;
    'count_preference'?: string;
    'hidden_state'?: string;
    'member_count'?: number;
    'joined_member_count'?: number;
    'member_state'?: string;
    'my_role'?: string;
    'user_last_read'?: number;
    'ts_message_offset'?: number;
    'message_survival_seconds'?: number;
    'read_receipt'?: object;
    'delivery_receipt'?: object;
    'members'?: MemberPayload[];
    'last_message'?: UserMessagePayload | FileMessagePayload | AdminMessagePayload;
    'inviter'?: UserPayload;
    'invited_at'?: number;
    'joined_ts'?: number;
    'is_created'?: boolean;
}
export default class GroupChannel extends BaseChannel {
    private _unreadMemberStateMap;
    private _undeliveredMemberStateMap;
    private _typingStatus;
    private _lastMemberCountUpdated;
    private _typingStarted;
    private _typingEnded;
    readonly isDistinct: boolean;
    readonly isSuper: boolean;
    readonly isBroadcast: boolean;
    readonly isPublic: boolean;
    readonly isDiscoverable: boolean;
    readonly isAccessCodeRequired: boolean;
    readonly isPushEnabled: boolean;
    unreadMessageCount: number;
    unreadMentionCount: number;
    members: Member[];
    memberCount: number;
    joinedMemberCount: number;
    hiddenState: HiddenState;
    lastMessage: BaseMessage;
    messageOffsetTimestamp: number;
    messageSurvivalSeconds: number;
    myMemberState: MemberState;
    myRole: Role;
    myMutedState: MutedState;
    myLastRead: number;
    myCountPreference: CountPreference;
    myPushTriggerOption: PushTriggerOption;
    inviter: User;
    invitedAt: number;
    joinedAt: number;
    /**
     * @private
     */
    constructor(_iid: string, payload: GroupChannelPayload);
    get isHidden(): boolean;
    get isTyping(): boolean;
    get cachedUnreadMemberState(): object;
    get cachedUndeliveredMemberState(): object;
    /**
     * @private
     */
    static payloadify(obj: GroupChannel): GroupChannelPayload;
    /**
     * @private
     */
    _updateUnreadCount(unreadMessageCount: number, unreadMentionCount: number): void;
    /**
     * @private
     */
    _updateUnreadMemberState(userId: string, ts: number): boolean;
    /**
     * @private
     */
    _updateUndeliveredMemberState(userId: string, ts: number): void;
    /**
     * @private
     */
    _updateTypingStatus(user: User, ts?: number): void;
    /**
     * @private
     */
    _invalidateTypingStatus(): boolean;
    /**
     * @private
     */
    _setLatestMemberCount(memberCount: number, joinedCount: number, ts: number): boolean;
    isReadMessage(message: BaseMessage): boolean;
    serialize(): object;
    createMessageCollection(params?: MessageCollectionParams): MessageCollection;
    createMemberListQuery(params?: MemberListQueryParams): MemberListQuery;
    addMember(member: Member, ts?: number): void;
    removeMember(member: Member): boolean;
    getUnreadMemberCount(message: BaseMessage): number;
    getUndeliveredMemberCount(message: BaseMessage): number;
    getReadMembers(message: SendableMessage, includeAllMembers?: boolean): Member[];
    getUnreadMembers(message: SendableMessage, includeAllMembers?: boolean): Member[];
    getReadStatus(includeAllMembers?: boolean): {
        [key: string]: ReadStatus;
    };
    getTypingUsers(): Member[];
    invalidateTypingStatus(): boolean;
    refresh(): Promise<GroupChannel>;
    freeze(): Promise<void>;
    unfreeze(): Promise<void>;
    updateChannel(params: GroupChannelUpdateParams): Promise<GroupChannel>;
    invite(users: User[]): Promise<GroupChannel>;
    inviteWithUserIds(userIds: string[]): Promise<GroupChannel>;
    join(accessCode?: string): Promise<GroupChannel>;
    leave(): Promise<void>;
    acceptInvitation(accessCode?: string): Promise<GroupChannel>;
    declineInvitation(): Promise<GroupChannel>;
    sendUserMessage(params: UserMessageParams): MessageRequestHandler;
    sendFileMessage(params: FileMessageParams): MessageRequestHandler;
    deleteMessage(message: SendableMessage): Promise<void>;
    hide(params: GroupChannelHideParams): Promise<GroupChannel>;
    unhide(): Promise<GroupChannel>;
    delete(): Promise<void>;
    markAsRead(): Promise<void>;
    markAsDelivered(): Promise<void>;
    startTyping(): Promise<void>;
    endTyping(): Promise<void>;
    registerScheduledUserMessage(params: ScheduledUserMessageParams): Promise<ScheduledUserMessage>;
    getMyPushTriggerOption(): Promise<PushTriggerOption>;
    setMyPushTriggerOption(option: PushTriggerOption): Promise<PushTriggerOption>;
    setMyCountPreference(preference: CountPreference): Promise<CountPreference>;
    resetMyHistory(): Promise<GroupChannel>;
}
