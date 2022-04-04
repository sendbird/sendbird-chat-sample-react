import InstancedObject, { InstancedObjectPayload } from './instancedObject';
import { MetaData } from './channel/types';
/**
 * @internal
 */
export interface UserPayload extends InstancedObjectPayload {
    'guest_id'?: string;
    'user_id': string;
    'nickname'?: string;
    'profile_url'?: string;
    'image'?: string;
    'require_auth_for_profile_image'?: boolean;
    'last_seen_at'?: number;
    'is_online'?: boolean | string;
    'is_active'?: boolean;
    'metadata'?: object;
    'friend_discovery_key'?: string;
    'friend_name'?: string;
    'preferred_languages'?: string[];
}
export declare enum UserOnlineState {
    ONLINE = "online",
    OFFLINE = "offline",
    NON_AVAILABLE = "nonavailable"
}
export default class User extends InstancedObject {
    readonly userId: string;
    readonly requireAuth: boolean;
    nickname: string;
    plainProfileUrl: string;
    metaData: object;
    connectionStatus: UserOnlineState;
    isActive: boolean;
    lastSeenAt: number;
    preferredLanguages: string[];
    friendDiscoveryKey: string;
    friendName: string;
    /**
     * @private
     */
    constructor(_iid: string, payload: UserPayload);
    static payloadify(obj: User): UserPayload;
    get profileUrl(): string;
    serialize(): object;
    private _isValidMetaData;
    private _applyMetaData;
    createMetaData(input: MetaData): Promise<object>;
    updateMetaData(input: MetaData, upsert?: boolean): Promise<object>;
    deleteMetaData(metadataKey: string): Promise<object>;
    deleteAllMetaData(): Promise<void>;
}
