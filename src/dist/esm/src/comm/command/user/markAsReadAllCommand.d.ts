import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface MarkAsReadAllRequestCommandParams {
    userId: string;
    channelUrls?: string[];
}
interface MarkAsReadAllRequestCommandPayload {
    channel_urls?: string[];
}
/**
 * @internal
 */
export declare class MarkAsReadAllRequestCommand extends APIRequestCommand {
    params: MarkAsReadAllRequestCommandPayload;
    constructor({ userId, channelUrls }: MarkAsReadAllRequestCommandParams);
}
/**
 * @internal
 */
export declare class MarkAsReadAllResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: {});
}
export {};
