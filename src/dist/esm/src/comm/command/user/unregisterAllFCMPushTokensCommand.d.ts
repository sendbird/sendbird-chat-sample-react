import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import User, { UserPayload } from '../../../model/user';
import { PushTokenType } from '../../../types';
/**
 * @internal
 */
export interface UnregisterAllFCMPushTokensRequestCommandParams {
    userId: string;
}
interface UnregisterAllFCMPushTokensResponseCommandPayload extends APIResponseCommandPayload {
    type: string;
    user: UserPayload;
}
/**
 * @internal
 */
export declare class UnregisterAllFCMPushTokensRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: UnregisterAllFCMPushTokensRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnregisterAllFCMPushTokensResponseCommand extends APIResponseCommand {
    type: PushTokenType;
    user: User;
    constructor(_iid: string, payload: UnregisterAllFCMPushTokensResponseCommandPayload);
}
export {};
