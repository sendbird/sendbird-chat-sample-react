import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
import BaseConnectionState from './baseState';
/**
 * @internal
 */
export default class ConnectionConnectedState extends BaseConnectionState {
    type: ConnectionStateType;
    onReconnect(context: ConnectionStateContext): Promise<void>;
    onDisconnect(context: ConnectionStateContext, { autoReconnect }: {
        autoReconnect: any;
    }): Promise<void>;
    onLogout(context: ConnectionStateContext): Promise<void>;
}
