import BaseStore from '../../store/baseStore';
declare type BlobId = string;
interface BlobContainerParams {
    dbname: string;
    collectionName: string;
    store: BaseStore;
}
export default class BlobContainer {
    readonly dbname: string;
    readonly collectionName: string;
    private _store;
    constructor({ dbname, collectionName, store, }: BlobContainerParams);
    private _makeShards;
    private _encode;
    private _decode;
    get(blobId: BlobId): Promise<Blob>;
    save(blob: Blob, key?: string): Promise<BlobId>;
    remove(blobId: BlobId): Promise<void>;
    clear(): Promise<void>;
}
export {};
