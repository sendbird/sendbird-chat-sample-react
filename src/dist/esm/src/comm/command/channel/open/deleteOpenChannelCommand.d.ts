import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import { OpenChannelPayload } from '../../../../model/channel/openChannel';
interface DeleteOpenChannelRequestCommandParams {
    channelUrl: string;
}
interface DeleteOpenChannelResponseCommandPayload extends OpenChannelPayload {
}
/**
 * @internal
 */
export declare class DeleteOpenChannelRequestCommand extends APIRequestCommand {
    constructor(params: DeleteOpenChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteOpenChannelResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: DeleteOpenChannelResponseCommandPayload);
}
export {};
