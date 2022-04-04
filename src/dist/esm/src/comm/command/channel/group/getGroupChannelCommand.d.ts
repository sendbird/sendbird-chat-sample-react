import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import GroupChannel, { GroupChannelPayload } from '../../../../model/channel/groupChannel';
interface GetGroupChannelRequestCommandParams {
    channelUrl: string;
    isInternalCall?: boolean;
}
interface GetGroupChannelRequestCommandPayload {
    show_member: boolean;
    show_read_receipt: boolean;
    show_delivery_receipt: boolean;
}
interface GetGroupChannelResponseCommandPayload extends GroupChannelPayload {
}
/**
 * @internal
 */
export declare class GetGroupChannelRequestCommand extends APIRequestCommand {
    params: GetGroupChannelRequestCommandPayload;
    constructor({ channelUrl, isInternalCall }: GetGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetGroupChannelResponseCommand extends APIResponseCommand {
    channel: GroupChannel;
    constructor(_iid: string, payload: GetGroupChannelResponseCommandPayload);
}
export {};
