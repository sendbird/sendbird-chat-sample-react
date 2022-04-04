import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import User, { UserPayload } from '../../../model/user';
import { PushTokenType } from '../../../types';
import { PushTokenTypePayload } from '../types';
/**
 * @internal
 */
export interface UnregisterAllAPNSPushTokensRequestCommandParams {
    userId: string;
}
interface UnregisterAllAPNSPushTokensResponseCommandPayload extends APIResponseCommandPayload {
    type: PushTokenTypePayload;
    user: UserPayload;
}
/**
 * @internal
 */
export declare class UnregisterAllAPNSPushTokensRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: UnregisterAllAPNSPushTokensRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnregisterAllAPNSPushTokensResponseCommand extends APIResponseCommand {
    type: PushTokenType;
    user: User;
    constructor(_iid: string, payload: UnregisterAllAPNSPushTokensResponseCommandPayload);
}
export {};
