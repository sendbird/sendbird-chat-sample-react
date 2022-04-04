import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface UnregisterFCMPushTokenRequestCommandParams {
    userId: string;
    token: string;
}
interface UnregisterFCMPushTokenResponseCommandPayload extends APIResponseCommandPayload {
    token: string;
    user: UserPayload;
}
/**
 * @internal
 */
export declare class UnregisterFCMPushTokenRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId, token }: UnregisterFCMPushTokenRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnregisterFCMPushTokenResponseCommand extends APIResponseCommand {
    token: string;
    user: User;
    constructor(_iid: string, payload: UnregisterFCMPushTokenResponseCommandPayload);
}
export {};
