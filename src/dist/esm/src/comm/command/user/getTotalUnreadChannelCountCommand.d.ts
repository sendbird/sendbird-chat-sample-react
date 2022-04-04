import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
/**
 * @internal
 */
export interface GetTotalUnreadChannelCountRequestCommandParams {
    userId: string;
}
interface GetTotalUnreadChannelCountResponseCommandPayload {
    unread_count: number;
}
/**
 * @internal
 */
export declare class GetTotalUnreadChannelCountRequestCommand extends APIRequestCommand {
    params: {};
    constructor({ userId }: GetTotalUnreadChannelCountRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetTotalUnreadChannelCountResponseCommand extends APIResponseCommand {
    unreadCount: number;
    constructor(_iid: string, payload: GetTotalUnreadChannelCountResponseCommandPayload);
}
export {};
