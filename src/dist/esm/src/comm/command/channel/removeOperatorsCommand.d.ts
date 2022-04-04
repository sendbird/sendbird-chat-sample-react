import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface RemoveOperatorsRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    operatorUserIds: string[];
}
interface RemoveOperatorsRequestCommandPayload {
    operator_ids: string[];
}
interface RemoveOperatorsResponseCommandPayload {
}
/**
 * @internal
 */
export declare class RemoveOperatorsRequestCommand extends APIRequestCommand {
    params: RemoveOperatorsRequestCommandPayload;
    constructor(params: RemoveOperatorsRequestCommandParams);
}
/**
 * @internal
 */
export declare class RemoveOperatorsResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: RemoveOperatorsResponseCommandPayload);
}
export {};
