import { ChannelEventCommandPayload } from './channelEventCommand';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import RestrictedUser, { RestrictedUserPayload } from '../../../model/restrictedUser';
import { ChannelType } from '../../../model/channel/types';
interface MuteUserRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
    seconds?: number;
    description?: string;
}
interface MuteUserRequestCommandPayload {
    user_id: string;
    seconds?: number;
    description?: string;
}
interface MuteUserResponseCommandPayload extends APIResponseCommandPayload {
}
/**
 * @internal
 */
export declare class MuteUserRequestCommand extends APIRequestCommand {
    params: MuteUserRequestCommandPayload;
    constructor(params: MuteUserRequestCommandParams);
}
/**
 * @internal
 */
export declare class MuteUserResponseCommand extends APIResponseCommand {
    constructor(_iid: string, payload: MuteUserResponseCommandPayload);
}
/**
 * @internal
 */
export interface MuteUserEventCommandPayload extends ChannelEventCommandPayload {
    data: RestrictedUserPayload;
}
/**
 * @internal
 */
export declare class MuteUserEventCommand extends WebSocketEventCommand {
    readonly user: RestrictedUser;
    constructor(_iid: string, _: string, payload: MuteUserEventCommandPayload);
}
export {};
