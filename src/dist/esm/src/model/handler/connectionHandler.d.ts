export default class ConnectionHandler {
    onConnected: (userId: string) => void;
    onReconnectStarted: () => void;
    onReconnectSucceeded: () => void;
    onReconnectFailed: () => void;
    onDisconnected: (userId: string) => void;
}
