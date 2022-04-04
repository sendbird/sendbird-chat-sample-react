/**
 * @internal
 */
export default class Auth {
    sessionKey: string;
    authToken: string;
    get hasSession(): boolean;
    clear(): void;
}
