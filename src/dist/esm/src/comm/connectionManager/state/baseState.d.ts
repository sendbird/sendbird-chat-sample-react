import ConnectionStateContext from '../context';
import { ConnectionStateType } from '../stateType';
/**
 * @internal
 */
export declare type ConnectionCallback = (err: Error) => void;
/**
 * @internal
 */
export default abstract class BaseConnectionState {
    readonly type: ConnectionStateType;
    run(context: ConnectionStateContext): Promise<void>;
    onConnect(context: ConnectionStateContext, url: string): Promise<void>;
    onReconnect(context: ConnectionStateContext): Promise<void>;
    onDisconnect(context: ConnectionStateContext, { error, autoReconnect, }: {
        error?: any;
        autoReconnect?: boolean;
    }): Promise<void>;
    onLogout(context: ConnectionStateContext): Promise<void>;
}
