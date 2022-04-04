import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelEventCommandPayload } from './channelEventCommand';
import { ChannelType } from '../../../model/channel/types';
import RestrictedUser, { RestrictedUserPayload } from '../../../model/restrictedUser';
interface BanUserRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
    seconds?: number;
    description?: string;
}
interface BanUserRequestCommandPayload {
    user_id: string;
    seconds?: number;
    description?: string;
}
/**
 * @internal
 */
export declare class BanUserRequestCommand extends APIRequestCommand {
    params: BanUserRequestCommandPayload;
    constructor(params: BanUserRequestCommandParams);
}
export declare class BanUserResponseCommand extends APIResponseCommand {
}
export interface BanUserEventCommandPayload extends ChannelEventCommandPayload {
    data: RestrictedUserPayload & {
        member_count?: number;
        joined_member_count?: number;
    };
}
/**
 * @internal
 */
export declare class BanUserEventCommand extends WebSocketEventCommand {
    readonly user: RestrictedUser;
    readonly memberCount: number;
    readonly joinedMemberCount: number;
    constructor(_iid: string, _: string, payload: BanUserEventCommandPayload);
}
export {};
