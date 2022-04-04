import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import GroupChannelListParams from '../../../../model/params/groupChannelListParams';
interface LoadMyGroupChannelListRequestCommandParams extends GroupChannelListParams {
    userId: string;
    token: string;
    limit: number;
}
interface LoadMyGroupChannelListRequestCommandPayload {
    token: string;
    limit: number;
    order: string;
    show_member: boolean;
    show_read_receipt: boolean;
    show_delivery_receipt: boolean;
    show_empty: boolean;
    member_state_filter: string;
    super_mode: string;
    public_mode: string;
    unread_filter: string;
    members_nickname_contains?: string;
    name_contains?: string;
    channel_urls?: string[];
    custom_types?: string[];
    custom_type_startswith?: string;
    hidden_mode?: string;
    metadata_order_key?: string;
    metadata_key?: string;
    metadata_values?: string[];
    metadata_value_startswith?: string;
    show_frozen?: boolean;
    show_metadata?: boolean;
    search_query?: string;
    search_fields?: string[];
    members_exactly_in?: string[];
    members_include_in?: string[];
    query_type?: string;
}
interface LoadMyGroupChannelListResponseCommandPayload extends APIResponseCommandPayload {
    next: string;
    channels?: GroupChannelPayload[];
    ts?: number;
}
/**
 * @internal
 */
export declare class LoadMyGroupChannelListRequestCommand extends APIRequestCommand {
    params: LoadMyGroupChannelListRequestCommandPayload;
    constructor(params: LoadMyGroupChannelListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadMyGroupChannelListResponseCommand extends APIResponseCommand {
    token: string;
    channels: GroupChannel[];
    ts: number;
    constructor(_iid: string, payload: LoadMyGroupChannelListResponseCommandPayload);
}
export {};
