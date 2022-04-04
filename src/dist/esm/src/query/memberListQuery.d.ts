import ChannelDataListQuery, { ChannelDataListQueryParams } from './channelDataListQuery';
import Member from '../model/channel/member';
import { MemberStateFilter, OperatorFilter } from '../model/channel/groupChannelFilter';
export interface MemberListQueryParams extends ChannelDataListQueryParams {
    mutedMemberFilter?: MutedMemberFilter;
    memberStateFilter?: MemberStateFilter;
    nicknameStartsWithFilter?: string;
    operatorFilter?: OperatorFilter;
    order?: MemberListOrder;
}
export declare enum MutedMemberFilter {
    ALL = "all",
    MUTED = "muted",
    UNMUTED = "unmuted"
}
export declare enum MemberListOrder {
    MEMBER_NICKNAME_ALPHABETICAL = "member_nickname_alphabetical",
    OPERATOR_THEN_MEMBER_ALPHABETICAL = "operator_then_member_alphabetical"
}
export default class MemberListQuery extends ChannelDataListQuery {
    readonly mutedMemberFilter: MutedMemberFilter;
    readonly memberStateFilter: MemberStateFilter;
    readonly nicknameStartsWithFilter: string;
    readonly operatorFilter: OperatorFilter;
    readonly order: MemberListOrder;
    /**
     * @private
     */
    constructor(iid: string, channelUrl: string, params: MemberListQueryParams);
    protected _validate(): boolean;
    next(): Promise<Member[]>;
}
