import APIRequestCommand from '../../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../../core/command/api/apiResponseCommand';
import Member, { MemberPayload } from '../../../../model/channel/member';
import { MemberListQueryParams } from '../../../../query/memberListQuery';
interface LoadMemberListRequestCommandParams extends MemberListQueryParams {
    channelUrl: string;
    token: string;
}
interface LoadMemberListRequestCommandPayload {
    token: string;
    limit: number;
    order: string;
    muted_member_filter: string;
    member_state_filter: string;
    operator_filter: string;
    nickname_startswith: string;
    show_member_is_muted: boolean;
    show_read_receipt: boolean;
    show_delivery_receipt: boolean;
}
interface LoadMemberListResponseCommandPayload extends APIResponseCommandPayload {
    next: string;
    members?: MemberPayload[];
}
/**
 * @internal
 */
export declare class LoadMemberListRequestCommand extends APIRequestCommand {
    params: LoadMemberListRequestCommandPayload;
    constructor(params: LoadMemberListRequestCommandParams);
}
/**
 * @internal
 */
export declare class LoadMemberListResponseCommand extends APIResponseCommand {
    token: string;
    members: Member[];
    constructor(_iid: string, payload: LoadMemberListResponseCommandPayload);
}
export {};
