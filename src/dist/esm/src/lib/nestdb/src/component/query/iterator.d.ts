import { QueryCondition } from './interface';
import BlockManager from '../../lib/block/manager';
import Indexer from '../../lib/indexer';
import { CursorIterator } from '../../lib/cursor';
interface QueryIteratorParams {
    condition?: QueryCondition;
    backward?: boolean;
    blockManager: BlockManager;
    indexer: Indexer;
}
export default class QueryIterator {
    readonly condition: QueryCondition;
    readonly backward: boolean;
    private _blockManager;
    private _indexer;
    constructor({ condition, backward, blockManager, indexer, }: QueryIteratorParams);
    findOptimizedStartPosition(): number;
    each(iterator: CursorIterator): Promise<void>;
}
export {};
