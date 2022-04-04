import { FileCompat } from '../../../types';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { ThumbnailSize } from '../../../model/params/fileMessageParams';
/**
 * @internal
 */
export interface UploadFileRequestCommandParams {
    file: FileCompat;
    channelUrl: string;
    thumbnailSizes?: ThumbnailSize[];
    requestId: string;
}
/**
 * @internal
 */
export declare class UploadFileRequestCommand extends APIRequestCommand {
    constructor(params: UploadFileRequestCommandParams);
}
/**
 * @internal
 */
export interface UploadFileResponseCommandPayload extends APIResponseCommandPayload {
    url: string;
    file_size?: number;
    thumbnails?: ThumbnailSize[];
    require_auth?: boolean;
}
/**
 * @internal
 */
export declare class UploadFileResponseCommand extends APIResponseCommand {
    readonly url: string;
    readonly fileSize: number;
    readonly thumbnailSizes: ThumbnailSize[];
    readonly requireAuth: boolean;
    constructor(_iid: string, payload: UploadFileResponseCommandPayload);
}
