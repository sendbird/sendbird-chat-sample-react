import OpenChannel from '../model/channel/openChannel';
import OpenChannelHandler from '../model/handler/openChannelHandler';
import OpenChannelCreateParams from '../model/params/openChannelCreateParams';
/**
 * @internal
 */
export default class OpenChannelManager {
    private _sdkState;
    private _requestQueue;
    private _openChannelCache;
    private _openChannelHandlers;
    private _dispatcher;
    constructor(_iid: string, { sdkState, dispatcher, requestQueue, }: {
        sdkState: any;
        dispatcher: any;
        requestQueue: any;
    });
    static of(_iid: string): OpenChannelManager;
    buildOpenChannelFromSerializedData(serialized: object): OpenChannel;
    getChannelFromCache(channelUrl: string): Promise<OpenChannel>;
    upsertChannelsToCache(channels: OpenChannel[]): Promise<void>;
    removeChannelsFromCache(channelUrls: string[]): Promise<void>;
    setEnteredToCache(channel: OpenChannel): void;
    setExitedToCache(channel: OpenChannel): void;
    private _handleEvent;
    addHandler(key: string, handler: OpenChannelHandler): void;
    removeHandler(key: string): void;
    clearHandler(): void;
    getChannel(channelUrl: string, internal?: boolean): Promise<OpenChannel>;
    getChannelWithoutCache(channelUrl: string, internal?: boolean): Promise<OpenChannel>;
    createChannel(params: OpenChannelCreateParams): Promise<OpenChannel>;
}
