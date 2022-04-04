import WebSocketEventCommand from '../../../core/command/websocket/websocketEventCommand';
interface GroupChannelMemberCountPayload {
    channel_url: string;
    member_count: number;
    joined_member_count: number;
    ts: number;
}
interface OpenChannelMemberCountPayload {
    channel_url: string;
    participant_count: number;
    ts: number;
}
interface MemberCountUpdateEventCommandPayload {
    group_channels: GroupChannelMemberCountPayload[];
    open_channels: OpenChannelMemberCountPayload[];
}
export interface GroupChannelMemberCount {
    channelUrl: string;
    memberCount: number;
    joinedMemberCount: number;
    updatedAt: number;
}
export interface OpenChannelMemberCount {
    channelUrl: string;
    participantCount: number;
    updatedAt: number;
}
/**
 * @internal
 */
export declare class MemberCountUpdateEventCommand extends WebSocketEventCommand {
    readonly groupChannelMemberCounts: GroupChannelMemberCount[];
    readonly openChannelMemberCounts: OpenChannelMemberCount[];
    constructor(_iid: string, _: string, payload: MemberCountUpdateEventCommandPayload);
}
export {};
