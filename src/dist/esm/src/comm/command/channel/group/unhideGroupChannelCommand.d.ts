import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../../core/command/api/apiResponseCommand';
interface UnhideGroupChannelRequestCommandParams {
    channelUrl: string;
}
interface UnhideGroupChannelRequestCommandPayload {
}
/**
 * @internal
 */
export declare class UnhideGroupChannelRequestCommand extends APIRequestCommand {
    params: UnhideGroupChannelRequestCommandPayload;
    constructor(params: UnhideGroupChannelRequestCommandParams);
}
/**
 * @internal
 */
export declare class UnhideGroupChannelResponseCommand extends APIResponseCommand {
}
export {};
