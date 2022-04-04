import SDKState from '../state';
import RequestQueue from './requestQueue';
import Auth from '../core/auth';
import { CommandDispatcher } from '../core/eventDispatcher';
import User from '../model/user';
import SessionHandler from '../model/handler/sessionHandler';
import { SessionRefreshWebSocketCommand } from './command/auth/sessionRefreshCommand';
import { Deferred } from '../utils/deferred';
import Logger from '../utils/logger';
interface SessionManagerParams {
    auth: Auth;
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
    requestQueue: RequestQueue;
    logger: Logger;
}
/**
 * @internal
 */
export default class SessionManager {
    readonly auth: Auth;
    private _sdkState;
    private _dispatcher;
    private _logger;
    private _requestQueue;
    private _currentConnectionStateType;
    currentUser: User;
    handler: SessionHandler;
    constructor({ auth, sdkState, dispatcher, requestQueue, logger }: SessionManagerParams);
    createRefreshWebsocketCommand(authToken: string): SessionRefreshWebSocketCommand;
    _refreshSessionKey(authToken: string, deferred: Deferred<void>): Promise<void>;
    _handleError(deferred?: Deferred<void>): void;
    refresh(): Promise<void>;
}
export {};
