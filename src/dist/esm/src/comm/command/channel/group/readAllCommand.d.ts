import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface ReadAllRequestCommandParams {
    userId: string;
    channelUrls?: string[];
}
interface ReadAllRequestCommandPayload {
    channel_urls?: string[];
}
/**
 * @internal
 */
export declare class ReadAllRequestCommand extends APIRequestCommand {
    params: ReadAllRequestCommandPayload;
    constructor({ userId, channelUrls }: ReadAllRequestCommandParams);
}
/**
 * @internal
 */
export declare class ReadAllResponseCommand extends APIResponseCommand {
}
export {};
