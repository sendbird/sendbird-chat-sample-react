import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface AddOperatorsRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    operatorUserIds: string[];
}
interface AddOperatorsRequestCommandPayload {
    operator_ids: string[];
}
/**
 * @internal
 */
export declare class AddOperatorsRequestCommand extends APIRequestCommand {
    params: AddOperatorsRequestCommandPayload;
    constructor(params: AddOperatorsRequestCommandParams);
}
export declare class AddOperatorsResponseCommand extends APIResponseCommand {
}
export {};
