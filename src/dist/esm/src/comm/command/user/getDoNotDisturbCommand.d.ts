import { PushPreferencePayload } from '../types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { DoNotDisturbPreference } from '../../../types';
/**
 * @internal
 */
export interface GetDoNotDisturbRequestCommandParams {
    userId: string;
}
interface GetDoNotDisturbResponseCommandPayload extends PushPreferencePayload {
}
/**
 * @internal
 */
export declare class GetDoNotDisturbRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: GetDoNotDisturbRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetDoNotDisturbResponseCommand extends APIResponseCommand {
    preference: DoNotDisturbPreference;
    constructor(_iid: string, payload: GetDoNotDisturbResponseCommandPayload);
}
export {};
