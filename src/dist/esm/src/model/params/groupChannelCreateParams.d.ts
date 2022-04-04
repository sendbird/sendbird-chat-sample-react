import { FileCompat } from '../../types';
export declare class GroupChannelCreateParamsProperties {
    invitedUserIds?: string[];
    channelUrl?: string;
    coverUrl?: string;
    coverImage?: FileCompat;
    isDistinct?: boolean;
    isSuper?: boolean;
    isBroadcast?: boolean;
    isPublic?: boolean;
    isDiscoverable?: boolean;
    isStrict?: boolean;
    isEphemeral?: boolean;
    accessCode?: string;
    name?: string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
    messageSurvivalSeconds?: number;
}
export default class GroupChannelCreateParams extends GroupChannelCreateParamsProperties {
    constructor(props?: GroupChannelCreateParamsProperties);
    validate(): boolean;
    addUserIds(userIds: string[]): void;
    addUserId(userId: string): void;
}
