import InstancedObject, { InstancedObjectPayload } from '../instancedObject';
import User, { UserPayload } from '../user';
/**
 * @internal
 */
export interface ReadStatusPayload extends InstancedObjectPayload {
    'channel_url': string;
    'channel_type': string;
    'user': UserPayload;
    'ts': number;
}
export default class ReadStatus extends InstancedObject {
    readonly channelUrl: string;
    readonly channelType: string;
    readonly reader: User;
    readonly readAt: number;
    /**
     * @private
     */
    constructor(_iid: string, payload: ReadStatusPayload);
}
