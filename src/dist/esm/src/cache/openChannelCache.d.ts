import InstancedObject from '../model/instancedObject';
import OpenChannel from '../model/channel/openChannel';
/**
 * @internal
 */
export default class OpenChannelCache extends InstancedObject {
    private _channels;
    private _enteredChannelUrls;
    get enteredChannels(): OpenChannel[];
    isEnteredChannel(channelUrl: string): boolean;
    enter(channelUrl: string): void;
    exit(channelUrl: string): void;
    exitAll(): void;
    get(channelUrl: string): Promise<OpenChannel>;
    upsert(channels: OpenChannel[]): Promise<void>;
    remove(channelUrl: string): Promise<void>;
    clear(): Promise<void>;
}
