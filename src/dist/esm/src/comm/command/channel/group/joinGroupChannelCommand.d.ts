import { ChannelEventCommand, ChannelEventCommandPayload } from '../channelEventCommand';
import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import Member, { MemberPayload } from '../../../../model/channel/member';
interface JoinGroupChannelRequestCommandParams {
    channelUrl: string;
    userId: string;
    accessCode?: string;
}
interface JoinGroupChannelRequestCommandPayload {
    user_id: string;
    access_code?: string;
}
interface JoinGroupChannelResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class JoinGroupChannelRequestCommand extends APIRequestCommand {
    params: JoinGroupChannelRequestCommandPayload;
    constructor(params: JoinGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class JoinGroupChannelResponseCommand extends APIResponseCommand {
    channel: GroupChannel;
    constructor(_iid: string, payload: JoinGroupChannelResponseCommandPayload);
}
interface JoinGroupChannelEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        member_count?: number;
        joined_member_count?: number;
        users?: MemberPayload[];
    } & MemberPayload;
}
/**
 * @internal
 */
export declare class JoinGroupChannelEventCommand extends ChannelEventCommand {
    readonly memberCount: number;
    readonly joinedMemberCount: number;
    readonly members: Member[];
    constructor(_iid: string, code: string, payload: JoinGroupChannelEventCommandPayload);
}
export {};
