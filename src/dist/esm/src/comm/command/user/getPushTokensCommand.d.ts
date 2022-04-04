import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTokens, PushTokenType } from '../../../types';
import { PushTokenTypePayload } from '../types';
/**
 * @internal
 */
export interface GetPushTokensRequestCommandParams {
    userId: string;
    type: PushTokenType;
    ts?: number;
    token?: string;
}
interface GetPushTokensRequestCommandPayload {
    created_ts?: number;
    token?: string;
}
interface GetPushTokensResponseCommandPayload {
    type: PushTokenTypePayload;
    device_tokens: string[];
    has_more: boolean;
    token: string;
}
/**
 * @internal
 */
export declare class GetPushTokensRequestCommand extends APIRequestCommand {
    params: GetPushTokensRequestCommandPayload;
    constructor({ userId, type, token, ts }: GetPushTokensRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetPushTokensResponseCommand extends APIResponseCommand {
    pushTokens: PushTokens;
    constructor(_iid: string, payload: GetPushTokensResponseCommandPayload);
}
export {};
