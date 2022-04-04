import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface UnregisterAPNSPushTokenRequestCommandParams {
    userId: string;
    token: string;
}
interface UnregisterAPNSPushTokenResponseCommandPayload extends APIResponseCommandPayload {
    token: string;
    user: UserPayload;
}
/**
 * @internal
 */
export declare class UnregisterAPNSPushTokenRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId, token }: UnregisterAPNSPushTokenRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnregisterAPNSPushTokenResponseCommand extends APIResponseCommand {
    token: string;
    user: User;
    constructor(_iid: string, payload: UnregisterAPNSPushTokenResponseCommandPayload);
}
export {};
