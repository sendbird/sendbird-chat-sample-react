import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface SetChannelInvitationPreferenceRequestCommandParams {
    userId: string;
    willAutoAccept: boolean;
}
interface SetChannelInvitationPreferenceRequestCommandPayload {
    auto_accept: boolean;
}
interface SetChannelInvitationPreferenceResponseCommandPayload {
    auto_accept: boolean;
}
/**
 * @internal
 */
export declare class SetChannelInvitationPreferenceRequestCommand extends APIRequestCommand {
    params: SetChannelInvitationPreferenceRequestCommandPayload;
    constructor({ userId, willAutoAccept }: SetChannelInvitationPreferenceRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetChannelInvitationPreferenceResponseCommand extends APIResponseCommand {
    autoAccept: boolean;
    constructor(_iid: string, payload: SetChannelInvitationPreferenceResponseCommandPayload);
}
export {};
