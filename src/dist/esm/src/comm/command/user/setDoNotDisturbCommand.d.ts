import { PushPreferencePayload } from '../types';
import { DoNotDisturbPreference } from '../../../types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface SetDoNotDisturbRequestCommandParams {
    userId: string;
    doNotDisturbOn: boolean;
    startHour: number;
    startMin: number;
    endHour: number;
    endMin: number;
    timezone: string;
}
interface SetDoNotDisturbRequestCommandPayload {
    do_not_disturb: boolean;
    start_hour: number;
    start_min: number;
    end_hour: number;
    end_min: number;
    timezone: string;
}
interface SetDoNotDisturbResponseCommandPayload extends PushPreferencePayload {
}
/**
 * @internal
 */
export declare class SetDoNotDisturbRequestCommand extends APIRequestCommand {
    params: SetDoNotDisturbRequestCommandPayload;
    constructor({ userId, doNotDisturbOn, startHour, startMin, endHour, endMin, timezone, }: SetDoNotDisturbRequestCommandParams);
}
/**
 * @internal
 */
export declare class SetDoNotDisturbResponseCommand extends APIResponseCommand {
    preference: DoNotDisturbPreference;
    constructor(_iid: string, payload: SetDoNotDisturbResponseCommandPayload);
}
export {};
