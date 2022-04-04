import Logger from '../utils/logger';
/**
 * @internal
 */
export default class OnlineDetector {
    readonly logger: Logger;
    readonly connectionDelegate: {
        reconnect: () => void;
        disconnect: () => void;
    };
    constructor({ logger, connectionDelegate, }: {
        logger: any;
        connectionDelegate: any;
    });
    get isAvailable(): boolean;
    onlineWorker(): void;
    offlineWorker(): void;
    start(): void;
    stop(): void;
}
