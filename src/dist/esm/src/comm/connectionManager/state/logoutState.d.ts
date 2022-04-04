import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
import BaseConnectionState from './baseState';
/**
 * @internal
 */
export default class ConnectionLogoutState extends BaseConnectionState {
    type: ConnectionStateType;
    run(context: ConnectionStateContext): Promise<void>;
}
