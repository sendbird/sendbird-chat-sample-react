import Transaction from '../transaction';
import { BlockKeyHash } from '../../type';
import BaseStore from '../../store/baseStore';
import { CollectionMetadata } from '../../component/collection/interface';
interface BlockManagerParams {
    dbname: string;
    collectionName: string;
    metadata: CollectionMetadata;
    hashFunction?: BlockKeyHash;
    transaction: Transaction;
    store: BaseStore;
}
export default class BlockManager {
    readonly dbname: string;
    readonly collectionName: string;
    readonly metadata: CollectionMetadata;
    readonly hashFunction: BlockKeyHash;
    private _transaction;
    private _store;
    constructor({ dbname, collectionName, metadata, hashFunction, transaction, store, }: BlockManagerParams);
    get keyName(): string;
    createBlockId(key: string, level?: number): string;
    private _findBlock;
    getFromBlock(key: string): Promise<object>;
    putToBlock(key: string, item: object): Promise<boolean>;
    removeFromBlock(key: string): Promise<boolean>;
    clearAllBlocks(): Promise<void>;
}
export {};
