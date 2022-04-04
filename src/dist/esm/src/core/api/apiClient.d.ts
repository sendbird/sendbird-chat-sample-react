import APIRequestCommand from '../command/api/apiRequestCommand';
import APIResponseCommand from '../command/api/apiResponseCommand';
/**
 * @internal
 */
export default class ApiClient {
    private _iid;
    private _auth;
    private _sdkState;
    private _dispatcher;
    private _logger;
    private _abortControl;
    constructor(_iid: string, { auth, sdkState, dispatcher, logger, }: {
        auth: any;
        sdkState: any;
        dispatcher: any;
        logger: any;
    });
    private get _userAgentWithExtension();
    private _createHeader;
    send(request: APIRequestCommand): Promise<APIResponseCommand>;
    cancel(requestId: string): void;
    cancelAll(): void;
}
