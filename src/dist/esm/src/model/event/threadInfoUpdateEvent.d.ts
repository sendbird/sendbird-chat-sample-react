import InstancedObject from '../instancedObject';
import { ChannelType } from '../channel/types';
import ThreadInfo, { ThreadInfoPayload } from '../message/threadInfo';
/**
 * @internal
 */
export interface ThreadInfoUpdateEventPayload {
    'thread_info': ThreadInfoPayload;
    'root_message_id': number;
    'channel_url': string;
    'channel_type': ChannelType;
}
export default class ThreadInfoUpdateEvent extends InstancedObject {
    readonly threadInfo: ThreadInfo;
    readonly targetMessageId: number;
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    /**
     * @private
     */
    constructor(_iid: string, payload: ThreadInfoUpdateEventPayload);
}
