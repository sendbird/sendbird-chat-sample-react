import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
import BaseConnectionState from './baseState';
/**
 * @internal
 */
export default class ConnectionConnectingState extends BaseConnectionState {
    type: ConnectionStateType;
    private _authToken;
    private _haltConnect;
    private _callbacks;
    constructor({ authToken }: {
        authToken: any;
    });
    flushCallbacks(err?: Error): void;
    run(context: ConnectionStateContext): Promise<void>;
    onConnect(context: ConnectionStateContext): Promise<void>;
    onDisconnect(context: ConnectionStateContext, { error }: {
        error?: any;
    }): Promise<void>;
    onLogout(context: ConnectionStateContext): Promise<void>;
}
