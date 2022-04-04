import { CacheItem } from '../cache';
interface BlockParams {
    blockId: string;
    keyName: string;
    items?: object[];
    limit: number;
}
export default class Block {
    readonly blockId: string;
    readonly keyName: string;
    readonly limit: number;
    private _items;
    constructor({ blockId, keyName, items, limit, }: BlockParams);
    static createFromCacheItem(cacheItem: CacheItem): Block;
    get isEmpty(): boolean;
    get items(): object[];
    serialize(): BlockParams;
    getItemByKey(key: string): object;
    has(key: string): boolean;
    add(item: object): boolean;
    remove(key: string): boolean;
    clear(): void;
}
export {};
