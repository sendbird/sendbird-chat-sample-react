import SendbirdChatOptions from './options';
import AppInfo from './appInfo';
import SDKState from './state';
import CacheContext from './cache/cacheContext';
import UserEventHandler from './model/handler/userEventHandler';
import ConnectionHandler from './model/handler/connectionHandler';
import { CommandDispatcher } from './core/eventDispatcher';
import RequestQueue from './comm/requestQueue';
import SessionManager from './comm/sessionManager';
import ConnectionManager from './comm/connectionManager';
import { Encryption } from './lib/nestdb/src/nest';
import BaseStore from './lib/nestdb/src/store/baseStore';
import Logger, { LogLevel } from './utils/logger';
/**
 * @internal
 */
export interface VaultParams {
    appId: string;
    appVersion?: string;
    options?: SendbirdChatOptions;
    apiHost?: string;
    websocketHost?: string;
    store: BaseStore;
    encryption?: Encryption;
    localCacheEnabled?: boolean;
    logLevel?: LogLevel;
    debugMode?: boolean;
    noPingpong?: boolean;
}
/**
 * @internal
 */
export default class Vault {
    sdkState: SDKState;
    appInfo: AppInfo;
    subscribedUnreadMessageCount: {
        all: number;
        customTypes: {
            [key: string]: number;
        };
        ts: number;
    };
    logger: Logger;
    connectedAt: number;
    requestQueue: RequestQueue;
    sessionManager: SessionManager;
    connectionManager: ConnectionManager;
    dispatcher: CommandDispatcher;
    connectionHandlers: Map<string, ConnectionHandler>;
    userEventHandlers: Map<string, UserEventHandler>;
    cacheContext: CacheContext;
    debugMode?: boolean;
    useMemberAsMessageSender: boolean;
    typingIndicatorInvalidateTime: number;
    typingIndicatorThrottle: number;
    maxSuperGroupChannelUnreadCount: number;
    concurrentCallLimit: number;
    backOffDelay: number;
    constructor(_iid: string, params: VaultParams);
    static of(_iid: string): Vault;
}
