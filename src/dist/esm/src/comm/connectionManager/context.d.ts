import ConnectionHandler from '../../model/handler/connectionHandler';
import { ConnectionStateType } from './stateType';
import BaseConnectionState from './state/baseState';
import ConnectionInitializedState from './state/initializedState';
import SDKState from '../../state';
import EventDispatcher from '../../core/eventDispatcher';
declare type ConnectionEventType = {
    'change': ConnectionStateType;
};
/**
 * @internal
 */
export default class ConnectionStateContext extends EventDispatcher<ConnectionEventType> {
    private _iid;
    private _currentState;
    readonly sdkState: SDKState;
    readonly connectionHandlers: Map<string, ConnectionHandler>;
    private _sessionManager;
    private _websocketClient;
    private _dispatcher;
    constructor(_iid: string, { sdkState, connectionHandlers, sessionManager, websocketClient, dispatcher, entryState, }: {
        sdkState: any;
        connectionHandlers: any;
        sessionManager: any;
        websocketClient: any;
        dispatcher: any;
        entryState?: ConnectionInitializedState;
    });
    get currentState(): BaseConnectionState;
    changeState(state: BaseConnectionState): Promise<void>;
    private _url;
    connect(authToken?: string): Promise<void>;
    disconnect(): void;
    logout(): void;
}
export {};
