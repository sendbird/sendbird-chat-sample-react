import { RetryStrategy } from './utils/retry';
/**
 * @internal
 */
export default interface SDKState {
    appId: string;
    appVersion?: string;
    appState: 'foreground' | 'background';
    userId: string;
    extensions?: object;
    api?: {
        host: string;
    };
    websocket?: {
        host: string;
        pingerDisabled?: boolean;
        pingInterval?: number;
        pongTimeout?: number;
        connectMaxRetry?: number;
        reconnectMaxRetry?: number;
        reconnectRetryStrategy?: RetryStrategy;
        responseTimeout?: number;
    };
}
