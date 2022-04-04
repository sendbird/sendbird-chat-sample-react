import SDKState from '../../state';
import PingCommand from '../command/websocket/pingCommand';
/**
 * @internal
 */
export default class Pinger {
    readonly pingDelegate: {
        send: (command: PingCommand) => void;
        error: (err: Error) => void;
    };
    readonly sdkState: SDKState;
    private _logger;
    private _pingTimer;
    private _pingTimeoutTimer;
    constructor({ pingDelegate, sdkState, logger, }: {
        pingDelegate: any;
        sdkState: any;
        logger: any;
    });
    get isWaiting(): boolean;
    ping(): PingCommand;
    pong(): void;
    refreshTimer(): void;
    start(): void;
    stop(): void;
}
