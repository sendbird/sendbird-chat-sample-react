import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelEventCommandPayload } from './channelEventCommand';
import { ChannelType, MetaCounter } from '../../../model/channel/types';
interface UpdateMetaCountersRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    metaCounter: object;
    upsert?: boolean;
    mode?: 'set' | 'increase' | 'decrease';
}
interface UpdateMetaCountersRequestCommandPayload {
    metacounter: object;
    upsert: boolean;
    mode: string;
}
interface UpdateMetaCountersResponseCommandPayload {
    metaCounter: object;
}
/**
 * @internal
 */
export declare class UpdateMetaCountersRequestCommand extends APIRequestCommand {
    params: UpdateMetaCountersRequestCommandPayload;
    constructor(params: UpdateMetaCountersRequestCommandParams);
}
/**
 * @internal
 */
export declare class UpdateMetaCountersResponseCommand extends APIResponseCommand {
    readonly metaCounter: object;
    constructor(_iid: string, payload: UpdateMetaCountersResponseCommandPayload);
}
/**
 * @internal
 */
export interface UpdateMetaCounterEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        created: MetaCounter;
        updated: MetaCounter;
        deleted: string[];
    };
}
/**
 * @internal
 */
export declare class UpdateMetaCounterEventCommand extends WebSocketEventCommand {
    readonly created: MetaCounter;
    readonly updated: MetaCounter;
    readonly deleted: string[];
    constructor(_iid: string, _: string, payload: UpdateMetaCounterEventCommandPayload);
}
export {};
