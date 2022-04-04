import InstancedObject, { InstancedObjectPayload } from '../instancedObject';
import User, { UserPayload } from '../user';
/**
 * @internal
 */
export interface ThreadInfoPayload extends InstancedObjectPayload {
    'reply_count': number;
    'most_replies': UserPayload[];
    'last_replied_at': number;
    'updated_at': number;
}
export default class ThreadInfo extends InstancedObject {
    readonly replyCount: number;
    readonly mostRepliedUsers: User[];
    readonly lastRepliedAt: number;
    readonly updatedAt: number;
    /**
     * @private
     */
    constructor(_iid: string, payload: ThreadInfoPayload);
    /**
     * @private
     */
    static payloadify(obj: ThreadInfo): ThreadInfoPayload;
}
