import BaseChannel from '../../model/channel/baseChannel';
/**
 * @internal
 */
export default class MessageChangelogSync {
    private _iid;
    private _channel;
    private _sync;
    private _metadataKey;
    private _metadata;
    constructor({ _iid, channel }: {
        _iid: any;
        channel: any;
    });
    static of(_iid: string, channel: BaseChannel): MessageChangelogSync;
    loadMetadata(): Promise<void>;
    saveMetadata(): Promise<void>;
    resume(): void;
    pause(): void;
}
