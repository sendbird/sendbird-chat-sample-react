import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface DeleteAllUserMetadataRequestCommandParams {
    userId: string;
}
/**
 * @internal
 */
export declare class DeleteAllUserMetadataRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: DeleteAllUserMetadataRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteAllUserMetadataResponseCommand extends APIResponseCommand {
}
