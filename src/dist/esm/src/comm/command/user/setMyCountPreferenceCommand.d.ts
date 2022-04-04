import { CountPreference } from '../../../model/channel/groupChannel';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { CountPreferencePayload } from '../types';
/**
 * @internal
 */
export interface SetMyCountPreferenceRequestCommandParams {
    userId: string;
    channelUrl: string;
    countPreference: CountPreference;
}
interface SetMyCountPreferenceRequestCommandPayload {
    count_preference?: CountPreferencePayload;
}
interface SetMyCountPreferenceResponseCommandPayload {
    count_preference?: CountPreferencePayload;
}
/**
 * @internal
 */
export declare class SetMyCountPreferenceRequestCommand extends APIRequestCommand {
    params: SetMyCountPreferenceRequestCommandPayload;
    constructor({ userId, channelUrl, countPreference }: SetMyCountPreferenceRequestCommandParams);
}
export declare class SetMyCountPreferenceResponseCommand extends APIResponseCommand {
    readonly countPreference: CountPreference;
    constructor(_iid: string, payload: SetMyCountPreferenceResponseCommandPayload);
}
export {};
