import { MetaData } from '../../../model/channel/types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface UpdateUserMetadataRequestCommandParams {
    userId: string;
    metadata: MetaData;
    upsert: boolean;
}
interface UpdateUserMetadataRequestCommandPayload {
    metadata: MetaData;
    upsert: boolean;
}
interface UpdateUserMetadataResponseCommandPayload extends MetaData {
}
/**
 * @internal
 */
export declare class UpdateUserMetadataRequestCommand extends APIRequestCommand {
    params: UpdateUserMetadataRequestCommandPayload;
    constructor({ userId, metadata, upsert }: UpdateUserMetadataRequestCommandParams);
}
/**
 * @internal
 */
export declare class UpdateUserMetadataResponseCommand extends APIResponseCommand {
    metadata: MetaData;
    constructor(_iid: string, payload: UpdateUserMetadataResponseCommandPayload);
}
export {};
