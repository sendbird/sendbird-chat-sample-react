import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import { GroupChannelPayload } from '../../../../model/channel/groupChannel';
interface DeleteGroupChannelRequestCommandParams {
    channelUrl: string;
}
interface DeleteGroupChannelResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class DeleteGroupChannelRequestCommand extends APIRequestCommand {
    constructor(params: DeleteGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class DeleteGroupChannelResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: DeleteGroupChannelResponseCommandPayload);
}
export {};
