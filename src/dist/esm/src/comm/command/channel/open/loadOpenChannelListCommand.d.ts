import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../../core/command/api/apiResponseCommand';
import { OpenChannelListQueryParams } from '../../../../query/openChannelListQuery';
import OpenChannel, { OpenChannelPayload } from '../../../../model/channel/openChannel';
interface LoadOpenChannelListRequestCommandParams extends OpenChannelListQueryParams {
    token: string;
    limit: number;
}
interface LoadOpenChannelListRequestCommandPayload {
    token: string;
    limit: number;
    name_contains?: string;
    url_contains?: string;
    custom_types?: string[];
    show_frozen?: boolean;
    show_metadata?: boolean;
}
interface LoadOpenChannelListResponseCommandPayload extends APIResponseCommandPayload {
    next: string;
    channels?: OpenChannelPayload[];
    ts?: number;
}
/**
 * @internal
 */
export declare class LoadOpenChannelListRequestCommand extends APIRequestCommand {
    params: LoadOpenChannelListRequestCommandPayload;
    constructor(params: LoadOpenChannelListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadOpenChannelListResponseCommand extends APIResponseCommand {
    token: string;
    channels: OpenChannel[];
    ts: number;
    constructor(_iid: string, payload: LoadOpenChannelListResponseCommandPayload);
}
export {};
