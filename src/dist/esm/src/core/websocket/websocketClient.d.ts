import WebSocketRequestCommand from '../command/websocket/websocketRequestCommand';
import WebSocketEventCommand from '../command/websocket/websocketEventCommand';
import EventDispatcher, { EventDispatcherContext } from '../eventDispatcher';
export declare enum ConnectionState {
    CONNECTING = "CONNECTING",
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}
declare type WebSocketEventType = {
    'open': void;
    'message': WebSocketEventCommand;
    'error': Error;
    'close': void;
};
/**
 * @internal
 */
export declare type WebSocketEventDispatcherContext = EventDispatcherContext<WebSocketEventType>;
/**
 * @internal
 */
export default class WebSocketClient extends EventDispatcher<WebSocketEventType> {
    private _iid;
    private _sdkState;
    private _ws;
    private _pinger;
    private _dispatcher;
    private _logger;
    lastActive: number;
    constructor(_iid: string, { sdkState, dispatcher, logger, }: {
        sdkState: any;
        dispatcher: any;
        logger: any;
    });
    get connectionState(): ConnectionState;
    connect(url: string): void;
    disconnect(): void;
    send(command: WebSocketRequestCommand): void;
    error(err: Error): void;
}
export {};
