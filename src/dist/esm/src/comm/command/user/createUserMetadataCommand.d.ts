import { MetaData } from '../../../model/channel/types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface CreateUserMetadataRequestCommandParams {
    userId: string;
    metadata: MetaData;
}
interface CreateUserMetadataRequestCommandPayload {
    metadata: MetaData;
}
interface CreateUserMetadataResponseCommandPayload extends MetaData {
}
/**
 * @internal
 */
export declare class CreateUserMetadataRequestCommand extends APIRequestCommand {
    params: CreateUserMetadataRequestCommandPayload;
    constructor({ userId, metadata }: CreateUserMetadataRequestCommandParams);
}
/**
 * @internal
 */
export declare class CreateUserMetadataResponseCommand extends APIResponseCommand {
    metadata: MetaData;
    constructor(_iid: string, payload: CreateUserMetadataResponseCommandPayload);
}
export {};
