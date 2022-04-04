import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import { ChannelEventCommand, ChannelEventCommandPayload } from '../channelEventCommand';
import User, { UserPayload } from '../../../../model/user';
import Member, { MemberPayload } from '../../../../model/channel/member';
interface DeclineInvitationRequestCommandParams {
    channelUrl: string;
    userId: string;
}
interface DeclineInvitationRequestCommandPayload {
    user_id: string;
}
interface DeclineInvitationResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class DeclineInvitationRequestCommand extends APIRequestCommand {
    params: DeclineInvitationRequestCommandPayload;
    constructor(params: DeclineInvitationRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeclineInvitationResponseCommand extends APIResponseCommand {
    channel: GroupChannel;
    constructor(_iid: string, payload: DeclineInvitationResponseCommandPayload);
}
interface DeclineInvitationEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        member_count?: number;
        joined_member_count?: number;
        inviter: UserPayload;
        invitee: MemberPayload;
    };
}
/**
 * @internal
 */
export declare class DeclineInvitationEventCommand extends ChannelEventCommand {
    readonly memberCount: number;
    readonly joinedMemberCount: number;
    readonly inviter: User;
    readonly invitee: Member;
    constructor(_iid: string, code: string, payload: DeclineInvitationEventCommandPayload);
}
export {};
