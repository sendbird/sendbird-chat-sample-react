import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import GroupChannelUnreadItemCountParams from '../../../model/params/unreadItemCountParams';
/**
 * @internal
 */
export interface GetUnreadItemCountRequestCommandParams {
    userId: string;
    filter: GroupChannelUnreadItemCountParams;
}
interface GetUnreadItemCountRequestCommandPayload {
    item_keys: string[];
}
interface GetUnreadItemCountResponseCommandPayload {
    [key: string]: number;
}
/**
 * @internal
 */
export declare class GetUnreadItemCountRequestCommand extends APIRequestCommand {
    params: GetUnreadItemCountRequestCommandPayload;
    constructor({ userId, filter }: GetUnreadItemCountRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetUnreadItemCountResponseCommand extends APIResponseCommand {
    groupChannelUnreadMentionCount?: number;
    groupChannelUnreadMessageCount?: number;
    groupChannelInvitationCount?: number;
    superGroupChannelUnreadMentionCount?: number;
    superGroupChannelUnreadMessageCount?: number;
    superGroupChannelInvitationCount?: number;
    nonSuperGroupChannelUnreadMentionCount?: number;
    nonSuperGroupChannelUnreadMessageCount?: number;
    nonSuperGroupChannelInvitationCount?: number;
    constructor(_iid: string, payload: GetUnreadItemCountResponseCommandPayload);
}
export interface UnreadItemCount {
    groupChannelUnreadMentionCount?: number;
    groupChannelUnreadMessageCount?: number;
    groupChannelInvitationCount?: number;
    superGroupChannelUnreadMentionCount?: number;
    superGroupChannelUnreadMessageCount?: number;
    superGroupChannelInvitationCount?: number;
    nonSuperGroupChannelUnreadMentionCount?: number;
    nonSuperGroupChannelUnreadMessageCount?: number;
    nonSuperGroupChannelInvitationCount?: number;
}
export {};
