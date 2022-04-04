import { BaseChannelHandlerParams } from './baseChannelHandler';
import User from '../user';
import GroupChannel from '../channel/groupChannel';
export declare abstract class GroupChannelHandlerParams extends BaseChannelHandlerParams {
    onUserJoined?: (channel: GroupChannel, user: User) => void;
    onUserLeft?: (channel: GroupChannel, user: User) => void;
    onUserReceivedInvitation?: (channel: GroupChannel, inviter: User, invitees: User[]) => void;
    onUserDeclinedInvitation?: (channel: GroupChannel, inviter: User, invitee: User) => void;
    onChannelHidden?: (channel: GroupChannel) => void;
    onUnreadMemberCountUpdated?: (channel: GroupChannel) => void;
    onUndeliveredMemberCountUpdated?: (channel: GroupChannel) => void;
    onTypingStatusUpdated?: (channel: GroupChannel) => void;
}
export default class GroupChannelHandler extends GroupChannelHandlerParams {
    constructor(params?: GroupChannelHandlerParams);
}
