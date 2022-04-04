import { PushPreferencePayload } from '../types';
import { SnoozePeriod } from '../../../types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface SetSnoozePeriodRequestCommandParams {
    userId: string;
    snoozeOn: boolean;
    startTs: number;
    endTs: number;
}
interface SetSnoozePeriodRequestCommandPayload {
    snooze_enabled: boolean;
    snooze_start_ts: number;
    snooze_end_ts: number;
}
interface SetSnoozePeriodResponseCommandPayload extends PushPreferencePayload {
}
/**
 * @internal
 */
export declare class SetSnoozePeriodRequestCommand extends APIRequestCommand {
    params: SetSnoozePeriodRequestCommandPayload;
    constructor({ userId, snoozeOn, startTs, endTs }: SetSnoozePeriodRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetSnoozePeriodResponseCommand extends APIResponseCommand {
    snoozePeriod: SnoozePeriod;
    constructor(_iid: string, payload: SetSnoozePeriodResponseCommandPayload);
}
export {};
