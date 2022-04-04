import { QueryCondition, QueryFetchParams } from './interface';
import BlockManager from '../../lib/block/manager';
import Indexer from '../../lib/indexer';
import Mutex from '../../util/mutex';
interface QueryParams {
    condition?: QueryCondition;
    backward?: boolean;
    mutex: Mutex;
    blockManager: BlockManager;
    indexer: Indexer;
}
export default class Query {
    private _iterator;
    private _mutex;
    constructor({ condition, backward, mutex, blockManager, indexer, }: QueryParams);
    fetch(params?: QueryFetchParams): Promise<object[]>;
    count(): Promise<number>;
}
export {};
