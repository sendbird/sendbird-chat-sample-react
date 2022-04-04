import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import { ChannelEventCommandPayload } from './channelEventCommand';
import { ChannelType, MetaData } from '../../../model/channel/types';
interface UpdateMetaDataRequestCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    metadata: object;
    upsert?: boolean;
}
interface UpdateMetaDataRequestCommandPayload {
    metadata: object;
    include_ts: boolean;
    upsert: boolean;
}
interface UpdateMetaDataResponseCommandPayload {
    metadata: object;
    ts?: number;
}
/**
 * @internal
 */
export declare class UpdateMetaDataRequestCommand extends APIRequestCommand {
    params: UpdateMetaDataRequestCommandPayload;
    constructor(params: UpdateMetaDataRequestCommandParams);
}
/**
 * @internal
 */
export declare class UpdateMetaDataResponseCommand extends APIResponseCommand {
    readonly metadata: object;
    readonly ts: number;
    constructor(_iid: string, payload: UpdateMetaDataResponseCommandPayload);
}
/**
 * @internal
 */
export interface UpdateMetaDataEventCommandPayload extends ChannelEventCommandPayload {
    data: {
        created: MetaData;
        updated: MetaData;
        deleted: string[];
    };
}
/**
 * @internal
 */
export declare class UpdateMetaDataEventCommand extends WebSocketEventCommand {
    readonly created: MetaData;
    readonly updated: MetaData;
    readonly deleted: string[];
    constructor(_iid: string, _: string, payload: UpdateMetaDataEventCommandPayload);
}
export {};
