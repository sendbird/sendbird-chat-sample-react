import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { PushTriggerOption } from '../../../types';
import { MyPushPreferencePayload, PushTriggerOptionPayload } from '../types';
/**
 * @internal
 */
export interface SetMyPushTriggerOptionRequestCommandParams {
    userId: string;
    channelUrl: string;
    pushTriggerOption?: PushTriggerOption;
    enable?: boolean;
}
interface SetMyPushTriggerOptionRequestCommandPayload {
    push_trigger_option?: PushTriggerOptionPayload;
    enable?: boolean;
}
interface SetMyPushTriggerOptionResponseCommandPayload extends MyPushPreferencePayload {
}
/**
 * @internal
 */
export declare class SetMyPushTriggerOptionRequestCommand extends APIRequestCommand {
    params: SetMyPushTriggerOptionRequestCommandPayload;
    constructor({ userId, channelUrl, pushTriggerOption, enable }: SetMyPushTriggerOptionRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetMyPushTriggerOptionResponseCommand extends APIResponseCommand {
    pushTriggerOption: PushTriggerOption;
    enabled: boolean;
    constructor(_iid: string, payload: SetMyPushTriggerOptionResponseCommandPayload);
}
export {};
