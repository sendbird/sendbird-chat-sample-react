import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
import BaseConnectionState from './baseState';
/**
 * @internal
 */
export default class ConnectionInitializedState extends BaseConnectionState {
    type: ConnectionStateType;
    onConnect(context: ConnectionStateContext, authToken: string): Promise<void>;
}
