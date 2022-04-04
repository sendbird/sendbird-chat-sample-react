import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelEventCommandPayload } from './channelEventCommand';
import { ChannelType } from '../../../model/channel/types';
import RestrictedUser, { RestrictedUserPayload } from '../../../model/restrictedUser';
interface UnbanUserRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
}
interface UnbanUserRequestCommandPayload {
    user_id: string;
}
/**
 * @internal
 */
export declare class UnbanUserRequestCommand extends APIRequestCommand {
    params: UnbanUserRequestCommandPayload;
    constructor(params: UnbanUserRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnbanUserResponseCommand extends APIResponseCommand {
}
/**
 * @internal
 */
export interface UnbanUserEventCommandPayload extends ChannelEventCommandPayload {
    data: RestrictedUserPayload;
}
/**
 * @internal
 */
export declare class UnbanUserEventCommand extends WebSocketEventCommand {
    readonly user: RestrictedUser;
    constructor(_iid: string, _: string, payload: UnbanUserEventCommandPayload);
}
export {};
