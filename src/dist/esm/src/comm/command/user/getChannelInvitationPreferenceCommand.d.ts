import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetChannelInvitationPreferenceRequestCommandParams {
    userId: string;
}
interface GetChannelInvitationPreferenceResponseCommandPayload {
    auto_accept: boolean;
}
/**
 * @internal
 */
export declare class GetChannelInvitationPreferenceRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: GetChannelInvitationPreferenceRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetChannelInvitationPreferenceResponseCommand extends APIResponseCommand {
    autoAccept: boolean;
    constructor(_iid: string, payload: GetChannelInvitationPreferenceResponseCommandPayload);
}
export {};
