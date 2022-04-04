declare type SessionTokenRefreshResolve = (authToken: string) => void;
declare type SessionTokenRefreshReject = (err: Error) => void;
export default class SessionHandler {
    onSessionExpired: () => void;
    onSessionTokenRequired: (resolve: SessionTokenRefreshResolve, reject: SessionTokenRefreshReject) => void;
    onSessionError: (err: Error) => void;
    onSessionRefreshed: () => void;
    onSessionClosed: () => void;
}
export {};
