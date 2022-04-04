import { FileCompat } from '../../types';
export declare class GroupChannelUpdateParamsProperties {
    coverUrl?: string;
    coverImage?: FileCompat;
    isDistinct?: boolean;
    isPublic?: boolean;
    isDiscoverable?: boolean;
    accessCode?: string;
    name?: string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
    messageSurvivalSeconds?: number;
}
export default class GroupChannelUpdateParams extends GroupChannelUpdateParamsProperties {
    constructor(props?: GroupChannelUpdateParamsProperties);
    validate(): boolean;
}
