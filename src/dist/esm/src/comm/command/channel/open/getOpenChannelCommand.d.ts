import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import OpenChannel, { OpenChannelPayload } from '../../../../model/channel/openChannel';
interface GetOpenChannelRequestCommandParams {
    channelUrl: string;
    isInternalCall?: boolean;
}
interface GetOpenChannelRequestCommandPayload {
}
interface GetOpenChannelResponseCommandPayload extends OpenChannelPayload {
}
/**
 * @internal
 */
export declare class GetOpenChannelRequestCommand extends APIRequestCommand {
    params: GetOpenChannelRequestCommandPayload;
    constructor({ channelUrl, isInternalCall }: GetOpenChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetOpenChannelResponseCommand extends APIResponseCommand {
    channel: OpenChannel;
    constructor(_iid: string, payload: GetOpenChannelResponseCommandPayload);
}
export {};
