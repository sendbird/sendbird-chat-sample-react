import TimeRange from '../../utils/timeRange';
/**
 * @internal
 */
export default class GroupChannelBackgroundSync {
    private _iid;
    private _sync;
    private _metadataKey;
    private _metadata;
    constructor({ _iid }: {
        _iid: any;
    });
    static of(_iid: string): GroupChannelBackgroundSync;
    get range(): TimeRange;
    get completed(): boolean;
    loadMetadata(): Promise<void>;
    saveMetadata(): Promise<void>;
    resume(): void;
    pause(): void;
}
