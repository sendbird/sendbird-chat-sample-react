import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTriggerOption } from '../../../types';
import { PushPreferencePayload } from '../types';
/**
 * @internal
 */
export interface GetPushTriggerOptionRequestCommandParams {
    userId: string;
}
interface GetPushTriggerOptionResponseCommandPayload extends PushPreferencePayload {
}
/**
 * @internal
 */
export declare class GetPushTriggerOptionRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: GetPushTriggerOptionRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetPushTriggerOptionResponseCommand extends APIResponseCommand {
    pushTriggerOption: PushTriggerOption;
    constructor(_iid: string, payload: GetPushTriggerOptionResponseCommandPayload);
}
export {};
