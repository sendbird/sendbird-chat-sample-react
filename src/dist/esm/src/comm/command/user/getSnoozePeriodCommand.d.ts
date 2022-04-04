import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { SnoozePeriod } from '../../../types';
import { PushPreferencePayload } from '../types';
/**
 * @internal
 */
export interface GetSnoozePeriodRequestCommandParams {
    userId: string;
}
interface GetSnoozePeriodResponseCommandPayload extends PushPreferencePayload {
}
/**
 * @internal
 */
export declare class GetSnoozePeriodRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: GetSnoozePeriodRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetSnoozePeriodResponseCommand extends APIResponseCommand {
    snoozePeriod: SnoozePeriod;
    constructor(_iid: string, payload: GetSnoozePeriodResponseCommandPayload);
}
export {};
