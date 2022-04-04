import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import OpenChannel, { OpenChannelPayload } from '../../../../model/channel/openChannel';
import { OpenChannelCreateParamsProperties } from '../../../../model/params/openChannelCreateParams';
import { FileCompat } from '../../../../types';
interface UpdateOpenChannelRequestCommandParams extends OpenChannelCreateParamsProperties {
}
interface UpdateOpenChannelRequestCommandPayload {
    cover_url?: string;
    cover_file?: FileCompat;
    channel_url?: string;
    name?: string;
    data?: string;
    custom_type?: string;
    operators?: string[];
}
interface UpdateOpenChannelResponseCommandPayload extends OpenChannelPayload {
}
/**
 * @internal
 */
export declare class UpdateOpenChannelRequestCommand extends APIRequestCommand {
    params: UpdateOpenChannelRequestCommandPayload;
    constructor(params: UpdateOpenChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class UpdateOpenChannelResponseCommand extends APIResponseCommand {
    channel: OpenChannel;
    constructor(_iid: string, payload: UpdateOpenChannelResponseCommandPayload);
}
export {};
