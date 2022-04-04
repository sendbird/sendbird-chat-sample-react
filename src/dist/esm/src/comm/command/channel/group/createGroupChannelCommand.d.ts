import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import { GroupChannelCreateParamsProperties } from '../../../../model/params/groupChannelCreateParams';
import { FileCompat } from '../../../../types';
interface CreateGroupChannelRequestCommandParams extends GroupChannelCreateParamsProperties {
    userId: string;
}
interface CreateGroupChannelRequestCommandPayload {
    user_ids: string[];
    cover_url?: string;
    cover_file?: FileCompat;
    channel_url?: string;
    is_distinct?: boolean;
    is_super?: boolean;
    is_broadcast?: boolean;
    is_public?: boolean;
    is_discoverable?: boolean;
    strict?: boolean;
    is_ephemeral?: boolean;
    access_code?: string;
    name?: string;
    data?: string;
    custom_type?: string;
    operator_ids?: string[];
    message_survival_seconds?: number;
}
interface CreateGroupChannelResponseCommandPayload extends GroupChannelPayload {
    is_created?: boolean;
}
/**
 * @internal
 */
export declare class CreateGroupChannelRequestCommand extends APIRequestCommand {
    params: CreateGroupChannelRequestCommandPayload;
    constructor(params: CreateGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class CreateGroupChannelResponseCommand extends APIResponseCommand {
    channel: GroupChannel;
    isCreated: boolean;
    constructor(_iid: string, payload: CreateGroupChannelResponseCommandPayload);
}
export {};
