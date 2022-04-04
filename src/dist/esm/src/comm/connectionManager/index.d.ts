import ConnectionHandler from '../../model/handler/connectionHandler';
import SessionManager from '../sessionManager';
import WebSocketClient from '../../core/websocket/websocketClient';
import { CommandDispatcher } from '../../core/eventDispatcher';
import SDKState from '../../state';
import Logger from '../../utils/logger';
interface ConnectionManagerParams {
    sdkState: SDKState;
    connectionHandlers: Map<string, ConnectionHandler>;
    dispatcher: CommandDispatcher;
    sessionManager: SessionManager;
    websocketClient: WebSocketClient;
    logger: Logger;
    disableAutoReconnect?: boolean;
}
/**
 * @internal
 */
export default class ConnectionManager {
    private _context;
    private _logger;
    constructor(_iid: string, { sdkState, connectionHandlers, sessionManager, websocketClient, dispatcher, logger, disableAutoReconnect, }: ConnectionManagerParams);
    get isConnected(): boolean;
    get isConnecting(): boolean;
    connect(authToken: string): Promise<void>;
    reconnect(): Promise<void>;
    background(): Promise<void>;
    disconnect(error?: Error): Promise<void>;
    logout(): Promise<void>;
}
export {};
