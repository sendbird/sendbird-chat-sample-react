import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
interface LoadPublicGroupChannelListRequestCommandParams {
    token: string;
    limit: number;
    order: string;
    includeEmpty: boolean;
    channelNameContainsFilter: string;
    channelUrlsFilter: string[];
    customTypesFilter: string[];
    customTypeStartsWithFilter: string;
    superChannelFilter: string;
    membershipFilter: string;
    metadataOrderKeyFilter: string;
    metadataKey: string;
    metadataValues: string[];
    metadataValueStartsWith: string;
    includeFrozen: boolean;
    includeMetaData: boolean;
}
interface LoadPublicGroupChannelListRequestCommandPayload {
    token: string;
    limit: number;
    order: string;
    show_member: boolean;
    show_read_receipt: boolean;
    show_delivery_receipt: boolean;
    show_empty: boolean;
    public_mode: string;
    public_membership_mode: string;
    name_contains?: string;
    channel_urls?: string[];
    custom_types?: string[];
    custom_type_startswith?: string;
    super_mode?: string;
    metadata_order_key?: string;
    metadata_key?: string;
    metadata_values?: string[];
    metadata_value_startswith?: string;
    show_frozen?: boolean;
    show_metadata?: boolean;
}
interface LoadPublicGroupChannelListResponseCommandPayload {
    next: string;
    channels?: GroupChannelPayload[];
    ts?: number;
}
/**
 * @internal
 */
export declare class LoadPublicGroupChannelListRequestCommand extends APIRequestCommand {
    params: LoadPublicGroupChannelListRequestCommandPayload;
    constructor(params: LoadPublicGroupChannelListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadPublicGroupChannelListResponseCommand extends APIResponseCommand {
    token: string;
    channels: GroupChannel[];
    ts: number;
    constructor(_iid: string, payload: LoadPublicGroupChannelListResponseCommandPayload);
}
export {};
