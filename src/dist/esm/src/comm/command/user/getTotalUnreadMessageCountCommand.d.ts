import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import GroupChannelTotalUnreadMessageCountParams from '../../../model/params/totalUnreadMessageCountParams';
/**
 * @internal
 */
export interface GetTotalUnreadMessageCountRequestCommandParams {
    userId: string;
    filter: GroupChannelTotalUnreadMessageCountParams;
}
interface GetTotalUnreadMessageCountRequestCommandPayload {
    super_mode: string;
    custom_types?: string[];
}
interface GetTotalUnreadMessageCountResponseCommandPayload {
    unread_count: number;
}
/**
 * @internal
 */
export declare class GetTotalUnreadMessageCountRequestCommand extends APIRequestCommand {
    params: GetTotalUnreadMessageCountRequestCommandPayload;
    constructor({ userId, filter }: GetTotalUnreadMessageCountRequestCommandParams);
}
/**
 * @internal
 */
export declare class GetTotalUnreadMessageCountResponseCommand extends APIResponseCommand {
    unreadCount: number;
    constructor(_iid: string, payload: GetTotalUnreadMessageCountResponseCommandPayload);
}
export {};
