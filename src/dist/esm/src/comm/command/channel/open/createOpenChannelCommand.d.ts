import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import { FileCompat } from '../../../../types';
import OpenChannel, { OpenChannelPayload } from '../../../../model/channel/openChannel';
import { OpenChannelCreateParamsProperties } from '../../../../model/params/openChannelCreateParams';
interface CreateOpenChannelRequestCommandParams extends OpenChannelCreateParamsProperties {
}
interface CreateOpenChannelRequestCommandPayload {
    cover_url?: string;
    cover_file?: FileCompat;
    channel_url?: string;
    name?: string;
    data?: string;
    custom_type?: string;
    operators?: string[];
}
interface CreateOpenChannelResponseCommandPayload extends OpenChannelPayload {
}
/**
 * @internal
 */
export declare class CreateOpenChannelRequestCommand extends APIRequestCommand {
    params: CreateOpenChannelRequestCommandPayload;
    constructor(params: CreateOpenChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class CreateOpenChannelResponseCommand extends APIResponseCommand {
    channel: OpenChannel;
    constructor(_iid: string, payload: CreateOpenChannelResponseCommandPayload);
}
export {};
