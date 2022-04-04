import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
import BaseConnectionState from './baseState';
/**
 * @internal
 */
export default class ConnectionReconnectingState extends BaseConnectionState {
    type: ConnectionStateType;
    private _haltConnect;
    private _resetConnect;
    private _callbacks;
    flushCallbacks(err?: Error): void;
    run(context: ConnectionStateContext): Promise<void>;
    onConnect(context: ConnectionStateContext, authToken: string): Promise<void>;
    onReconnect(context: ConnectionStateContext): Promise<void>;
    onDisconnect(context: ConnectionStateContext, { error, autoReconnect }: {
        error?: any;
        autoReconnect?: boolean;
    }): Promise<void>;
    onLogout(context: ConnectionStateContext): Promise<void>;
}
