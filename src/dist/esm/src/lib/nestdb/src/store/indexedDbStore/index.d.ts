import BaseStore, { StoreItem } from '../baseStore';
import Encryption from '../encrypt';
interface IndexedDbStoreParams {
    encryption?: Encryption;
}
export default class IndexedDbStore implements BaseStore {
    dbname: string;
    itemSizeLimit: number;
    private _window;
    private _indexedDB;
    private _database;
    private _encryption;
    constructor(params?: IndexedDbStoreParams);
    init(dbname: string): Promise<void>;
    getAllKeys(): Promise<string[]>;
    get(key: string): Promise<object>;
    set(item: StoreItem): Promise<object>;
    setMany(items: StoreItem[]): Promise<object[]>;
    remove(key: string): Promise<string>;
    removeMany(keys: string[]): Promise<string[]>;
    clear(): Promise<void>;
}
export {};
