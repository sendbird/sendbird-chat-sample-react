import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
import { GroupChannelUpdateParamsProperties } from '../../../../model/params/groupChannelUpdateParams';
import { FileCompat } from '../../../../types';
interface UpdateGroupChannelRequestCommandParams extends GroupChannelUpdateParamsProperties {
    channelUrl: string;
}
interface UpdateGroupChannelRequestCommandPayload {
    is_distinct?: boolean;
    is_public?: boolean;
    is_discoverable?: boolean;
    cover_url?: string;
    cover_file?: FileCompat;
    access_code?: string;
    name?: string;
    data?: string;
    custom_type?: string;
    operator_ids?: string[];
    message_survival_seconds?: number;
}
interface UpdateGroupChannelResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class UpdateGroupChannelRequestCommand extends APIRequestCommand {
    params: UpdateGroupChannelRequestCommandPayload;
    constructor(params: UpdateGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class UpdateGroupChannelResponseCommand extends APIResponseCommand {
    channel: GroupChannel;
    constructor(_iid: string, payload: UpdateGroupChannelResponseCommandPayload);
}
export {};
