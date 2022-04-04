import { ChannelEventCommandPayload } from '../channelEventCommand';
import { GroupChannelHideParamsProperties } from '../../../../model/params/groupChannelHideParams';
import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../../core/command/websocket/websocketEventCommand';
interface HideGroupChannelRequestCommandParams extends GroupChannelHideParamsProperties {
    channelUrl: string;
    userId: string;
}
interface HideGroupChannelRequestCommandPayload {
    user_id: string;
    hide_previous_messages: boolean;
    allow_auto_unhide: boolean;
}
interface HideGroupChannelResponseCommandPayload {
    ts_message_offset: number;
}
/**
 * @internal
 */
export declare class HideGroupChannelRequestCommand extends APIRequestCommand {
    params: HideGroupChannelRequestCommandPayload;
    constructor(params: HideGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class HideGroupChannelResponseCommand extends APIResponseCommand {
    messageOffsetTimestamp: number;
    constructor(_iid: string, payload: HideGroupChannelResponseCommandPayload);
}
/**
 * @internal
 */
export interface HideGroupChannelEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        allow_auto_unhide?: boolean;
        hide_previous_messages?: boolean;
    };
    ts_message_offset?: number;
}
/**
 * @internal
 */
export declare class HideGroupChannelEventCommand extends WebSocketEventCommand {
    readonly allowAutoUnhide: boolean;
    readonly hidePreviousMessages: boolean;
    readonly messageOffsetTimestamp: number;
    constructor(_iid: string, _: string, payload: HideGroupChannelEventCommandPayload);
}
export {};
