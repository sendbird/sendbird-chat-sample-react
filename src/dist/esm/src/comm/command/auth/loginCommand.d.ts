import WebsocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import AppInfo, { AppInfoParams } from '../../../appInfo';
import User, { UserPayload } from '../../../model/user';
import SendbirdError, { SendbirdErrorParams } from '../../../error';
/**
 * @internal
 */
export interface LoginCommandPayload extends AppInfoParams, UserPayload, SendbirdErrorParams {
    key?: string;
    ekey?: string;
    ping_interval?: number;
    pong_timeout?: number;
    reconnect?: {
        interval?: number;
        max_interval?: number;
        retry_cnt?: number;
        mul?: number;
    };
    login_ts?: number;
    max_unread_cnt_on_super_group?: number;
    profile_image_encryption?: boolean;
    concurrent_call_limit?: number;
    back_off_delay?: number;
    error?: boolean;
}
/**
 * @internal
 */
export default class LoginCommand extends WebsocketEventCommand {
    readonly appInfo: AppInfo;
    readonly user: User;
    readonly key: string;
    readonly ekey: string;
    readonly connectedAt: number;
    readonly pingInterval: number;
    readonly pongTimeout: number;
    readonly reconnectInterval: number;
    readonly reconnectMaxInterval: number;
    readonly reconnectRetryCount: number;
    readonly reconnectIntervalMultiple: number;
    readonly maxUnreadCountOnSuperGroup: number;
    readonly profileImageEncryption: boolean;
    readonly concurrentCallLimit: number;
    readonly backOffDelay: number;
    readonly error: SendbirdError;
    constructor(_iid: string, code: string, payload: LoginCommandPayload);
    static asError(err: Error): LoginCommand;
    applyTo(_iid: string): void;
}
