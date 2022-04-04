import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../model/channel/groupChannel';
import { GroupChannelChangeLogsParamsProperties } from '../../../model/params/groupChannelChangeLogsParams';
/**
 * @internal
 */
export interface GetMyGroupChannelChangelogsRequestCommandParams {
    userId: string;
    ts?: number;
    token?: string;
    filter?: GroupChannelChangeLogsParamsProperties;
}
interface GetMyGroupChannelChangelogsRequestCommandPayload {
    show_member: boolean;
    show_read_receipt: boolean;
    show_delivery_receipt: boolean;
    change_ts?: number;
    token?: string;
    custom_types?: string[];
    show_empty?: boolean;
    show_frozen?: boolean;
}
interface GetMyGroupChannelChangelogsResponseCommandPayload extends APIResponseCommandPayload {
    updated: GroupChannelPayload[];
    deleted: string[];
    has_more: boolean;
    next: string;
}
/**
 * @internal
 */
export declare class GetMyGroupChannelChangelogsRequestCommand extends APIRequestCommand {
    params: GetMyGroupChannelChangelogsRequestCommandPayload;
    constructor({ userId, ts, token, filter, }: GetMyGroupChannelChangelogsRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetMyGroupChannelChangelogsResponseCommand extends APIResponseCommand {
    updatedChannels: GroupChannel[];
    deletedChannelUrls: string[];
    hasMore: boolean;
    token: string;
    constructor(_iid: string, payload: GetMyGroupChannelChangelogsResponseCommandPayload);
}
export {};
