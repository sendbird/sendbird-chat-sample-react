import { BaseChannelHandlerParams } from './baseChannelHandler';
import User from '../user';
import OpenChannel from '../channel/openChannel';
export declare abstract class OpenChannelHandlerParams extends BaseChannelHandlerParams {
    onUserEntered?: (channel: OpenChannel, user: User) => void;
    onUserExited?: (channel: OpenChannel, user: User) => void;
    onChannelParticipantCountChanged?: (channel: OpenChannel) => void;
}
export default class OpenChannelHandler extends OpenChannelHandlerParams {
    constructor(params?: OpenChannelHandlerParams);
}
