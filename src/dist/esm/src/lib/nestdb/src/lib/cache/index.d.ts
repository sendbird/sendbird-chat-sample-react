import BaseStore from '../../store/baseStore';
interface CacheParams {
    dbname: string;
    limit?: number;
}
export declare enum CacheState {
    PENDING = "pending",
    PERSISTENT = "persistent",
    VOLATILE = "volatile"
}
export interface CacheItem {
    state: CacheState;
    key: string;
    value: object;
    generation: number;
}
export declare enum CacheGetOptions {
    NO_CACHE = 0,
    DEFAULT = 1,
    PERSISTENT = 2
}
declare type CacheClearCondition = (cacheItem: CacheItem) => boolean;
export default class Cache {
    readonly dbname: string;
    private _items;
    private _limit;
    constructor({ dbname, limit, }: CacheParams);
    static get(dbname: string): Cache;
    get items(): CacheItem[];
    find(store: BaseStore, key: string, options?: CacheGetOptions): Promise<CacheItem>;
    get(key: string, options?: CacheGetOptions): CacheItem;
    put(cacheItem: CacheItem): void;
    remove(key: string): void;
    clearByCondition(condition: CacheClearCondition): void;
    clear(force?: boolean): void;
}
export {};
