import SDKState from '../state';
import Auth from '../core/auth';
import { CommandDispatcher } from '../core/eventDispatcher';
import CommandRouter from '../core/commandRouter';
import APIRequestCommand from '../core/command/api/apiRequestCommand';
import APIResponseCommand from '../core/command/api/apiResponseCommand';
import WebSocketEventCommand from '../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../core/command/websocket/websocketRequestCommand';
import Logger from '../utils/logger';
interface RequestQueueParams {
    auth: Auth;
    sdkState: SDKState;
    dispatcher: CommandDispatcher;
    logger: Logger;
}
/**
 * @internal
 */
export default class RequestQueue {
    readonly commandRouter: CommandRouter;
    private _auth;
    private _currentConnectionStateType;
    private _dispatcher;
    private _logger;
    private _lazyCallQueue;
    constructor(_iid: string, { auth, sdkState, dispatcher, logger, }: RequestQueueParams);
    get isReady(): boolean;
    get isLazyCallActivated(): boolean;
    send(command: WebSocketRequestCommand | APIRequestCommand): Promise<WebSocketEventCommand | APIResponseCommand>;
    forceSend(command: WebSocketRequestCommand | APIRequestCommand): Promise<WebSocketEventCommand | APIResponseCommand>;
    timeout(requestId: string): void;
    cancel(requestId: string): void;
    cancelAll(): void;
}
export {};
