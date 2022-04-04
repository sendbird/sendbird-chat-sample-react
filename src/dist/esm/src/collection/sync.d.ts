import EventDispatcher from '../core/eventDispatcher';
/**
 * @internal
 */
export declare enum SyncState {
    IDLE = 0,
    RUNNING = 1,
    END = 2
}
/**
 * @internal
 */
export interface SyncResult<NextToken> {
    hasNext: boolean;
    nextToken: NextToken;
}
/**
 * @internal
 */
export default class Sync<NextToken> extends EventDispatcher<{
    'progress': SyncResult<NextToken>;
    'stop': void;
    'error': Error;
    'end': void;
}> {
    private _worker;
    private _state;
    private _semaphore;
    private _retryCount;
    private _retryLimit;
    private _key;
    priority: number;
    constructor(key: string, worker: (params: NextToken) => Promise<SyncResult<NextToken>>, concurrentCallLimit?: number, backOffDelay?: number);
    get isIdle(): boolean;
    get isRunning(): boolean;
    get isDone(): boolean;
    get retryCount(): number;
    get retryLimit(): number;
    private _run;
    start(nextToken: NextToken): void;
    stop(): void;
    end(): void;
}
