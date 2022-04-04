import Transaction from '../transaction';
import { ColumnValues, IndexerItem } from './interface';
import BaseStore from '../../store/baseStore';
interface IndexerParams {
    dbname: string;
    collectionName: string;
    keyName: string;
    fields: string[];
    transaction: Transaction;
    store: BaseStore;
}
export default class Indexer {
    readonly indexerKey: string;
    readonly dbname: string;
    readonly collectionName: string;
    readonly keyName: string;
    readonly fields: string[];
    /** what's difference between origin and indextable?
     *  - origin: pointing to cache item value, updated on commit.
     *  - indextable: copy of origin, updated on request.
     *
     *  why is the separation necessary?
     *  - if it updates the origin directly on request,
     *    it's getting impossible to revert it.
     *    if transaction operation fails, it should recover to the origin.
     */
    private _origin;
    private _table;
    private _transaction;
    private _store;
    constructor({ dbname, collectionName, keyName, fields, transaction, store, }: IndexerParams);
    static createKey(index: string[]): string;
    static parseKey(key: string): string[];
    private _addItem;
    private _removeItem;
    get origin(): IndexerItem[];
    get table(): IndexerItem[];
    getColumnValues(item: object): ColumnValues;
    diff(a: ColumnValues, b: ColumnValues): number;
    indexOf(columnValues: ColumnValues): [number, boolean];
    ensure(): Promise<void>;
    drop(): Promise<void>;
    addItem(item: object): Promise<void>;
    removeItem(item: object): Promise<void>;
    clear(): Promise<void>;
    commit(): void;
    abort(): void;
}
export {};
