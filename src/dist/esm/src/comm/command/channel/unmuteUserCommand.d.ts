import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelEventCommandPayload } from './channelEventCommand';
import { ChannelType } from '../../../model/channel/types';
import RestrictedUser, { RestrictedUserPayload } from '../../../model/restrictedUser';
interface UnmuteUserRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
}
interface UnmuteUserRequestCommandPayload {
    user_id: string;
}
/**
 * @internal
 */
export declare class UnmuteUserRequestCommand extends APIRequestCommand {
    params: UnmuteUserRequestCommandPayload;
    constructor(params: UnmuteUserRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnmuteUserResponseCommand extends APIResponseCommand {
}
/**
 * @internal
 */
export interface UnmuteUserEventCommandPayload extends ChannelEventCommandPayload {
    data: RestrictedUserPayload;
}
/**
 * @internal
 */
export declare class UnmuteUserEventCommand extends WebSocketEventCommand {
    readonly user: RestrictedUser;
    constructor(_iid: string, _: string, payload: UnmuteUserEventCommandPayload);
}
export {};
