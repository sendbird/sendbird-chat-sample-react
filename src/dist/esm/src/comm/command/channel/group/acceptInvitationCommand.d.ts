import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
interface AcceptInvitationRequestCommandParams {
    channelUrl: string;
    userId: string;
    accessCode?: string;
}
interface AcceptInvitationRequestCommandPayload {
    user_id: string;
    access_code?: string;
}
declare type AcceptInvitationResponseCommandPayload = GroupChannelPayload;
/**
 * @internal
 */
export declare class AcceptInvitationRequestCommand extends APIRequestCommand {
    params: AcceptInvitationRequestCommandPayload;
    constructor(params: AcceptInvitationRequestCommandParams);
}
/**
 * @internal
 */
export declare class AcceptInvitationResponseCommand extends APIResponseCommand {
    readonly channel: GroupChannel;
    constructor(_iid: string, payload: AcceptInvitationResponseCommandPayload);
}
export {};
