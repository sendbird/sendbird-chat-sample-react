import SendbirdError, { SendbirdErrorParams } from '../../../error';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
import WebSocketRequestCommand from '../../../core/command/websocket/websocketRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface SessionRefreshAPIResponsePayload {
    'key': string;
}
/**
 * @internal
 */
export interface SessionRefreshWebSocketResponsePayload {
    'error'?: SendbirdErrorParams;
    'new_key'?: string;
}
/**
 * @internal
 */
export declare class SessionRefreshAPICommand extends APIRequestCommand {
    constructor({ userId, authToken, expiringSession, }: {
        userId: any;
        authToken: any;
        expiringSession?: boolean;
    });
}
/**
 * @internal
 */
export declare class SessionRefreshWebSocketCommand extends WebSocketRequestCommand {
    constructor({ authToken, expiringSession }: {
        authToken: any;
        expiringSession?: boolean;
    });
}
export declare class SessionRefreshAPIResponseCommand extends APIResponseCommand {
    key: string;
    constructor(_iid: string, payload: SessionRefreshAPIResponsePayload);
}
export declare class SessionRefreshWebSocketResponseCommand extends WebSocketEventCommand {
    readonly error: SendbirdError;
    readonly newKey: string;
    constructor(_iid: string, _: string, payload: SessionRefreshWebSocketResponsePayload);
}
