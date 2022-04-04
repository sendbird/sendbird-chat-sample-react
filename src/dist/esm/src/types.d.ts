import User from './model/user';
export interface FileInfo {
    name: string;
    uri: string;
    type: string;
}
export declare type FileCompat = File | Blob | FileInfo;
export interface FriendChangelogs {
    addedUsers: User[];
    updatedUsers: User[];
    deletedUserIds: string[];
    hasMore: boolean;
    token: string;
}
export interface FriendDiscovery {
    friendDiscoveryKey: string;
    friendName: string;
}
export declare enum PushTokenRegistrationState {
    SUCCESS = "success",
    PENDING = "pending",
    ERROR = "error"
}
export declare enum PushTriggerOption {
    DEFAULT = "default",
    ALL = "all",
    MENTION_ONLY = "mention_only",
    OFF = "off"
}
export declare enum PushTokenType {
    FCM = "gcm",
    APNS = "apns",
    UNKNOWN = "unknown"
}
export interface PushTokens {
    deviceTokens: string[];
    type: PushTokenType;
    hasMore: boolean;
    token: string;
}
export declare enum PushTemplate {
    ALTERNATIVE = "alternative",
    DEFAULT = "default"
}
export interface InvitationPreference {
    autoAccept: boolean;
}
export interface DoNotDisturbPreference {
    doNotDisturbOn: boolean;
    startHour?: number;
    startMin?: number;
    endHour?: number;
    endMin?: number;
    timezone?: string;
}
export interface SnoozePeriod {
    isSnoozeOn: boolean;
    startTs?: number;
    endTs?: number;
}
