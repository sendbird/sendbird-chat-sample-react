import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import Member, { MemberPayload } from '../../../../model/channel/member';
import { ChannelEventCommand, ChannelEventCommandPayload } from '../channelEventCommand';
interface LeaveGroupChannelRequestCommandParams {
    channelUrl: string;
    userId: string;
}
interface LeaveGroupChannelRequestCommandPayload {
    user_id: string;
}
interface LeaveGroupChannelResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class LeaveGroupChannelRequestCommand extends APIRequestCommand {
    params: LeaveGroupChannelRequestCommandPayload;
    constructor(params: LeaveGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class LeaveGroupChannelResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: LeaveGroupChannelResponseCommandPayload);
}
interface LeaveGroupChannelEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        member_count?: number;
        joined_member_count?: number;
    } & MemberPayload;
}
/**
 * @internal
 */
export declare class LeaveGroupChannelEventCommand extends ChannelEventCommand {
    readonly memberCount: number;
    readonly joinedMemberCount: number;
    readonly member: Member;
    constructor(_iid: string, code: string, payload: LeaveGroupChannelEventCommandPayload);
}
export {};
