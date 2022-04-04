import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTriggerOption } from '../../../types';
import { MyPushPreferencePayload } from '../types';
/**
 * @internal
 */
export interface GetMyPushTriggerOptionRequestCommandParams {
    userId: string;
    channelUrl: string;
}
interface GetMyPushTriggerOptionResponseCommandPayload extends MyPushPreferencePayload {
}
/**
 * @internal
 */
export declare class GetMyPushTriggerOptionRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId, channelUrl }: GetMyPushTriggerOptionRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMyPushTriggerOptionResponseCommand extends APIResponseCommand {
    pushTriggerOption: PushTriggerOption;
    enabled: boolean;
    constructor(_iid: string, payload: GetMyPushTriggerOptionResponseCommandPayload);
}
export {};
