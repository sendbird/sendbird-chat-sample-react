import SDKState from '../state';
import CacheContext from '../cache/cacheContext';
import { CommandDispatcher } from '../core/eventDispatcher';
import SessionManager from '../comm/sessionManager';
import RequestQueue from '../comm/requestQueue';
export declare type ModuleNamespaces<T extends Module[], M extends T[number] = T[number]> = {
    [key in M['name']]: M extends {
        name: key;
    } ? Omit<M, keyof Module> : never;
};
/**
 * @internal
 */
export interface ModuleParams {
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
    sessionManager: SessionManager;
    requestQueue: RequestQueue;
    cacheContext?: CacheContext;
}
export default abstract class Module {
    protected _iid: string;
    protected _cacheContext: CacheContext;
    protected _sdkState: SDKState;
    protected _dispatcher: CommandDispatcher;
    protected _sessionManager: SessionManager;
    protected _requestQueue: RequestQueue;
    readonly name: string;
    /**
     * @internal
     */
    init(_iid: string, { sdkState, dispatcher, sessionManager, requestQueue, cacheContext }: ModuleParams): void;
}
