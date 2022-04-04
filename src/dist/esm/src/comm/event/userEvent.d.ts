import User from '../../model/user';
/**
 * @internal
 */
export declare enum UserEventCategory {
    USER_BLOCK = 20001,
    USER_UNBLOCK = 20000,
    FRIEND_DISCOVERED = 20900
}
/**
 * @internal
 */
export interface UserEventPayload {
    cat: number;
    data: object;
}
/**
 * @internal
 */
export interface UserBlockEvent {
    blocker: User;
    blockee: User;
}
/**
 * @internal
 */
export interface FriendDiscoveredEvent {
    friendDiscoveries: User[];
}
/**
 * @internal
 */
export default class UserEvent {
    readonly category: UserEventCategory;
    readonly data: object;
    constructor(payload: UserEventPayload);
    static getDataAsUserBlockEvent(_iid: string, event: UserEvent): UserBlockEvent;
    static getDataAsFriendDiscoveredEvent(_iid: string, event: UserEvent): FriendDiscoveredEvent;
}
