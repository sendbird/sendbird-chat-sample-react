/**
 * @internal
 */
export default class GroupChannelChangelogSync {
    private _iid;
    private _sync;
    private _metadataKey;
    private _metadata;
    constructor({ _iid }: {
        _iid: any;
    });
    static of(_iid: string): GroupChannelChangelogSync;
    loadMetadata(): Promise<void>;
    saveMetadata(): Promise<void>;
    resume(): void;
    pause(): void;
}
