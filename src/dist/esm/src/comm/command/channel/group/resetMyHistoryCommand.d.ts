import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
interface ResetMyHistoryRequestCommandParams {
    channelUrl: string;
}
interface ResetMyHistoryRequestCommandPayload {
}
interface ResetMyHistoryResponseCommandPayload {
    ts_message_offset?: number;
}
/**
 * @internal
 */
export declare class ResetMyHistoryRequestCommand extends APIRequestCommand {
    params: ResetMyHistoryRequestCommandPayload;
    constructor(params: ResetMyHistoryRequestCommandParams);
}
/**
 * @internal
 */
export declare class ResetMyHistoryResponseCommand extends APIResponseCommand {
    messageOffsetTimestamp: number;
    constructor(_iid: string, payload: ResetMyHistoryResponseCommandPayload);
}
export {};
