import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { ChannelType, MetaData } from '../../../model/channel/types';
interface CreateMetaDataRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    metadata: object;
}
interface CreateMetaDataRequestCommandPayload {
    metadata: object;
    include_ts: boolean;
}
interface CreateUserMetadataResponseCommandPayload extends MetaData {
}
/**
 * @internal
 */
export declare class CreateMetaDataRequestCommand extends APIRequestCommand {
    params: CreateMetaDataRequestCommandPayload;
    constructor(params: CreateMetaDataRequestCommandParams);
}
/**
 * @internal
 */
export declare class CreateMetaDataResponseCommand extends APIResponseCommand {
    readonly metaData: MetaData;
    constructor(_iid: string, payload: CreateUserMetadataResponseCommandPayload);
}
export {};
