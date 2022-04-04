import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import User, { UserPayload } from '../../../model/user';
import { PushTokenType } from '../../../types';
/**
 * @internal
 */
export interface RegisterFCMPushTokenRequestCommandParams {
    userId: string;
    token: string;
}
interface RegisterFCMPushTokenRequestCommandPayload {
    gcm_reg_token: string;
    always_push: boolean;
}
interface RegisterFCMPushTokenResponseCommandPayload extends APIResponseCommandPayload {
    token: string;
    type: string;
    user: UserPayload;
}
/**
 * @internal
 */
export declare class RegisterFCMPushTokenRequestCommand extends APIRequestCommand {
    params: RegisterFCMPushTokenRequestCommandPayload;
    constructor({ userId, token }: RegisterFCMPushTokenRequestCommandParams);
}
/**
 * @internal
 */
export declare class RegisterFCMPushTokenResponseCommand extends APIResponseCommand {
    token: string;
    type: PushTokenType;
    user: User;
    constructor(_iid: string, payload: RegisterFCMPushTokenResponseCommandPayload);
}
export {};
