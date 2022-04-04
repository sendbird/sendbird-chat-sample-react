import SDKState from '../state';
import Auth from './auth';
import { CommandDispatcher } from './eventDispatcher';
import ApiClient from './api/apiClient';
import APIRequestCommand from './command/api/apiRequestCommand';
import APIResponseCommand from './command/api/apiResponseCommand';
import WebSocketClient from './websocket/websocketClient';
import WebSocketRequestCommand from './command/websocket/websocketRequestCommand';
import WebSocketEventCommand from './command/websocket/websocketEventCommand';
import Logger from '../utils/logger';
interface CommandRouterParams {
    auth: Auth;
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
    logger: Logger;
}
/**
 * @internal
 */
export default class CommandRouter {
    readonly apiClient: ApiClient;
    readonly websocketClient: WebSocketClient;
    private _sdkState;
    private _ackStateMap;
    private _dispatcher;
    private _logger;
    constructor(_iid: string, { auth, sdkState, dispatcher, logger, }: CommandRouterParams);
    private _sendApiRequest;
    private _sendWebsocketRequest;
    send(req: APIRequestCommand | WebSocketRequestCommand): Promise<APIResponseCommand | WebSocketEventCommand>;
    cancel(requestId: string): void;
    cancelAll(): void;
}
export {};
