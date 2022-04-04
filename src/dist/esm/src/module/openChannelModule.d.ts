import SendbirdChat from '../sendbird';
import Module from './baseModule';
import { FileCompat } from '../types';
import OpenChannel from '../model/channel/openChannel';
import OpenChannelHandler from '../model/handler/openChannelHandler';
import OpenChannelCreateParams from '../model/params/openChannelCreateParams';
import OpenChannelUpdateParams from '../model/params/openChannelUpdateParams';
import OpenChannelListQuery, { OpenChannelListQueryParams } from '../query/openChannelListQuery';
import ParticipantListQuery from '../query/participantListQuery';
declare class OpenChannelModule extends Module {
    name: 'openChannel';
    private _manager;
    /**
     * @internal
     */
    init(_iid: string, { sdkState, cacheContext, dispatcher, sessionManager, requestQueue, }: {
        sdkState: any;
        cacheContext: any;
        dispatcher: any;
        sessionManager: any;
        requestQueue: any;
    }): void;
    createOpenChannelListQuery(params?: OpenChannelListQueryParams): OpenChannelListQuery;
    addOpenChannelHandler(key: string, handler: OpenChannelHandler): void;
    removeOpenChannelHandler(key: string): void;
    removeAllOpenChannelHandlers(): void;
    buildOpenChannelFromSerializedData(serialized: object): OpenChannel;
    getChannel(channelUrl: string): Promise<OpenChannel>;
    getChannelWithoutCache(channelUrl: string): Promise<OpenChannel>;
    createChannel(params: OpenChannelCreateParams): Promise<OpenChannel>;
    createChannelWithOperatorUserIds(name: string, coverUrlOrImageFile: FileCompat | string, data: string, operatorUserIds: string[], customType: string): Promise<OpenChannel>;
}
declare type SendbirdOpenChat = SendbirdChat & {
    openChannel: OpenChannelModule;
};
export { OpenChannel, OpenChannelCreateParams, OpenChannelHandler, OpenChannelListQuery, OpenChannelListQueryParams, OpenChannelModule, OpenChannelUpdateParams, ParticipantListQuery, SendbirdOpenChat, };
