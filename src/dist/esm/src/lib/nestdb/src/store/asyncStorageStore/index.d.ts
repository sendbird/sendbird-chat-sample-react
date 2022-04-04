import BaseStore, { StoreItem } from '../baseStore';
import Encryption from '../encrypt';
import { AsyncStorageStatic } from './interface';
interface AsyncStorageStoreParams {
    AsyncStorage: AsyncStorageStatic;
    encryption?: Encryption;
}
export default class AsyncStorageStore implements BaseStore {
    dbname: string;
    itemSizeLimit: number;
    private _asyncStorage;
    private _encryption;
    constructor({ AsyncStorage, encryption, }: AsyncStorageStoreParams);
    private _isBelonging;
    private _getActualKey;
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
