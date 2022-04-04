import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTriggerOption } from '../../../types';
import { PushPreferencePayload, PushTriggerOptionPayload } from '../types';
/**
 * @internal
 */
export interface SetPushTriggerOptionRequestCommandParams {
    userId: string;
    pushTriggerOption: PushTriggerOption;
}
interface SetPushTriggerOptionRequestCommandPayload {
    push_trigger_option: PushTriggerOptionPayload;
}
interface SetPushTriggerOptionResponseCommandPayload extends PushPreferencePayload {
}
/**
 * @internal
 */
export declare class SetPushTriggerOptionRequestCommand extends APIRequestCommand {
    params: SetPushTriggerOptionRequestCommandPayload;
    constructor({ userId, pushTriggerOption }: SetPushTriggerOptionRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetPushTriggerOptionResponseCommand extends APIResponseCommand {
    pushTriggerOption: PushTriggerOption;
    constructor(_iid: string, payload: SetPushTriggerOptionResponseCommandPayload);
}
export {};
