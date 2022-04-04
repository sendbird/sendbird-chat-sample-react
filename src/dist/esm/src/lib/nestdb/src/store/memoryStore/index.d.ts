import BaseStore, { StoreItem } from '../baseStore';
import Encryption from '../encrypt';
interface MemoryStoreParams {
    itemSizeLimit?: number;
    delay?: number;
    encryption?: Encryption;
}
export default class MemoryStore implements BaseStore {
    private _encryption;
    dbname: string;
    itemSizeLimit: number;
    delay: number;
    observer: Record<string, unknown>;
    constructor(params?: MemoryStoreParams);
    get rawData(): object;
    set rawData(value: object);
    observe(key: string, ops: string[], handler: () => Error): void;
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
