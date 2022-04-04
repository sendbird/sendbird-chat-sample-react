import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface DeleteUserMetadataRequestCommandParams {
    userId: string;
    metadataKey: string;
}
/**
 * @internal
 */
export declare class DeleteUserMetadataRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId, metadataKey }: DeleteUserMetadataRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteUserMetadataResponseCommand extends APIResponseCommand {
}
