import NestDB from '../lib/nestdb/src/nest';
import BaseStore from '../lib/nestdb/src/store/baseStore';
import Encryption from '../lib/nestdb/src/store/encrypt';
/**
 * @internal
 */
export default class CacheContext {
    store: BaseStore;
    nestdb: NestDB;
    encryption: Encryption;
    localCacheEnabled: boolean;
    constructor({ encryption, store, localCacheEnabled, }: {
        encryption?: any;
        store?: any;
        localCacheEnabled?: boolean;
    });
}
