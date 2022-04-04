import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
import BaseConnectionState from './baseState';
/**
 * @internal
 */
export default class ConnectionDisconnectedState extends BaseConnectionState {
    type: ConnectionStateType;
    private _autoReconnect;
    constructor({ autoReconnect }: {
        autoReconnect: any;
    });
    run(context: ConnectionStateContext): Promise<void>;
    onConnect(context: ConnectionStateContext, authToken: string): Promise<void>;
    onReconnect(context: ConnectionStateContext): Promise<void>;
    onLogout(context: ConnectionStateContext): Promise<void>;
}
