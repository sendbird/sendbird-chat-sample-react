import BaseChannel from '../../model/channel/baseChannel';
import BaseMessage from '../../model/message/baseMessage';
import TimeRange from '../../utils/timeRange';
/**
 * @internal
 */
export default class MessageBackgroundSync {
    private _iid;
    private _channel;
    private _prevSync;
    private _nextSync;
    private _metadataKey;
    private _metadata;
    constructor({ _iid, channel }: {
        _iid: any;
        channel: any;
    });
    static of(_iid: string, channel: BaseChannel): MessageBackgroundSync;
    get range(): TimeRange;
    get previousComplete(): boolean;
    extendRange(messages: BaseMessage[]): void;
    loadMetadata(): Promise<void>;
    saveMetadata(): Promise<void>;
    resume(): void;
    pause(): void;
}
