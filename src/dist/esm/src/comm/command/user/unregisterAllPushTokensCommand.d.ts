import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface UnregisterAllPushTokensRequestCommandParams {
    userId: string;
}
interface UnregisterAllPushTokensResponseCommandPayload extends APIResponseCommandPayload {
    user: UserPayload;
}
/**
 * @internal
 */
export declare class UnregisterAllPushTokensRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: UnregisterAllPushTokensRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnregisterAllPushTokensResponseCommand extends APIResponseCommand {
    user: User;
    constructor(_iid: string, payload: UnregisterAllPushTokensResponseCommandPayload);
}
export {};
