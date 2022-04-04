import Config from './config';
import { BlockKeyHash } from './type';
import NestDBError from './error';
import Collection from './component/collection';
import Query from './component/query';
import Cursor from './lib/cursor';
import Encryption from './store/encrypt';
import BaseStore from './store/baseStore';
import MemoryStore from './store/memoryStore';
import IndexedDbStore from './store/indexedDbStore';
import AsyncStorageStore from './store/asyncStorageStore';
declare enum NestDBState {
    INIT = "INIT",
    OPENING = "OPENING",
    OPENED = "OPENED",
    CLOSED = "CLOSED"
}
interface NestDBParams {
    name: string;
    version: number;
    store: BaseStore;
    config?: Config;
}
interface NestDBSchema {
    collectionName: string;
    keyName: string;
    keyHash?: BlockKeyHash;
    index?: string[][];
}
export default class NestDB {
    readonly name: string;
    private _version;
    private _state;
    private _config;
    private _store;
    private _event;
    private _collections;
    private _globalMutex;
    constructor({ name, version, store, config, }: NestDBParams);
    get version(): number;
    get state(): NestDBState;
    commitSchema(schemas: Array<NestDBSchema>): Promise<void>;
    open(): Promise<void>;
    close(): void;
    reset(): Promise<void>;
    on(eventType: string, handler: Function): void;
    off(eventType: string): void;
    collection(collectionName: string): Collection;
}
export { NestDBState, NestDBError, Config, Collection, Query, Cursor, Encryption, MemoryStore, IndexedDbStore, AsyncStorageStore, };
