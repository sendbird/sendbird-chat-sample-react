import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType } from '../../../model/channel/types';
interface CreateMetaCountersRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    metaCounter: object;
}
interface CreateMetaCountersRequestCommandPayload {
    metacounter: object;
}
interface CreateMetaCountersResponseCommandPayload {
    metaCounter: object;
}
/**
 * @internal
 */
export declare class CreateMetaCountersRequestCommand extends APIRequestCommand {
    params: CreateMetaCountersRequestCommandPayload;
    constructor(params: CreateMetaCountersRequestCommandParams);
}
/**
 * @internal
 */
export declare class CreateMetaCountersResponseCommand extends APIResponseCommand {
    readonly metaCounter: object;
    constructor(_iid: string, payload: CreateMetaCountersResponseCommandPayload);
}
export {};
