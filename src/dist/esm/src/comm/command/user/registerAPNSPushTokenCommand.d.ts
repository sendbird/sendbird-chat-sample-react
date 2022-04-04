import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import User, { UserPayload } from '../../../model/user';
import { PushTokenType } from '../../../types';
import { PushTokenTypePayload } from '../types';
/**
 * @internal
 */
export interface RegisterAPNSPushTokenRequestCommandParams {
    userId: string;
    token: string;
}
interface RegisterAPNSPushTokenRequestCommandPayload {
    apns_device_token: string;
    always_push: boolean;
}
interface RegisterAPNSPushTokenResponseCommandPayload extends APIResponseCommandPayload {
    token: string;
    type: PushTokenTypePayload;
    user: UserPayload;
}
/**
 * @internal
 */
export declare class RegisterAPNSPushTokenRequestCommand extends APIRequestCommand {
    params: RegisterAPNSPushTokenRequestCommandPayload;
    constructor({ userId, token }: RegisterAPNSPushTokenRequestCommandParams);
}
/**
 * @internal
 */
export declare class RegisterAPNSPushTokenResponseCommand extends APIResponseCommand {
    token: string;
    type: PushTokenType;
    user: User;
    constructor(_iid: string, payload: RegisterAPNSPushTokenResponseCommandPayload);
}
export {};
