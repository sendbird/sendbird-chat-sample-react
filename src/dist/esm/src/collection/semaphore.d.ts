declare type Resolver = (key: string) => void;
interface SemaphoreParams {
    key: string;
    concurrentCallLimit?: number;
    backOffDelay?: number;
}
declare type SemaphoreResolverData = {
    key?: string;
    resolver?: Resolver;
    priority?: number;
};
/**
 * @internal
 */
export declare class Semaphore {
    private readonly _holdersKey;
    private readonly _resolversKey;
    private readonly _chainProcessStateKey;
    private readonly _numLocks;
    private readonly _backOffDelay;
    private _localAcquiredKeys;
    private _localResolversData;
    constructor({ key, concurrentCallLimit, backOffDelay, }: SemaphoreParams);
    static createSemaphoreHoldersKey(key: string): string;
    static createSemaphoreResolversKey(key: string): string;
    static createChainProcessStateKey(key: string): string;
    get numLocks(): number;
    get backOffDelay(): number;
    get numLocksAvailable(): number;
    get waitCount(): number;
    _hasHighestPriorityResolver(): boolean;
    _isProcessChainAcquireRunning(): boolean;
    _setProcessChainAcquireRunning(isRunning: boolean): void;
    _processChainResolve(): Promise<void>;
    acquire(priority?: number): Promise<string>;
    release(key: string): boolean;
    _tryResolve(): boolean;
    _getLocalHoldersData(): string[];
    _getLocalResolversData(): SemaphoreResolverData[];
}
export default Semaphore;
