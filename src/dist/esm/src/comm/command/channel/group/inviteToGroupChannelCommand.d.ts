import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import { ChannelEventCommand, ChannelEventCommandPayload } from '../channelEventCommand';
import User, { UserPayload } from '../../../../model/user';
import Member, { MemberPayload } from '../../../../model/channel/member';
interface InviteToGroupChannelRequestCommandParams {
    channelUrl: string;
    userIds: string[];
}
interface InviteToGroupChannelRequestCommandPayload {
    user_ids: string[];
}
interface InviteToGroupChannelResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class InviteToGroupChannelRequestCommand extends APIRequestCommand {
    params: InviteToGroupChannelRequestCommandPayload;
    constructor(params: InviteToGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class InviteToGroupChannelResponseCommand extends APIResponseCommand {
    channel: GroupChannel;
    constructor(_iid: string, payload: InviteToGroupChannelResponseCommandPayload);
}
interface InviteToGroupChannelEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        member_count?: number;
        joined_member_count?: number;
        inviter: UserPayload;
        invitees: MemberPayload[];
    };
}
/**
 * @internal
 */
export declare class InviteToGroupChannelEventCommand extends ChannelEventCommand {
    readonly memberCount: number;
    readonly joinedMemberCount: number;
    readonly inviter: User;
    readonly invitees: Member[];
    constructor(_iid: string, code: string, payload: InviteToGroupChannelEventCommandPayload);
}
export {};
