import { TransactionRequestData, TransactionEventHandler, TransactionEventType, TransactionRequestOptions } from './interface';
import BaseStore from '../../store/baseStore';
interface TransactionParams {
    dbname: string;
    collectionName: string;
    store: BaseStore;
    applyDelay?: number;
}
export default class Transaction {
    readonly dbname: string;
    readonly collectionName: string;
    readonly metadataKey: string;
    readonly recordsetKey: string;
    private _metadata;
    private _requests;
    private _store;
    private _onCommit;
    private _onWrite;
    private _onError;
    constructor({ dbname, collectionName, store, }: TransactionParams);
    get generation(): number;
    get requestCount(): number;
    private _getReducedRecordset;
    private _reduceRecordSet;
    private _applyRecord;
    init(): Promise<void>;
    on(eventType: TransactionEventType, key: string, handler: TransactionEventHandler<TransactionRequestData[] | Error>): void;
    requestWrite(item: TransactionRequestData, options?: TransactionRequestOptions): void;
    requestMultipleWrite(items: TransactionRequestData[], options?: TransactionRequestOptions): void;
    clear(): Promise<void>;
    commit(): Promise<void>;
}
export {};
