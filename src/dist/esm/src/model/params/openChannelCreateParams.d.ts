import { FileCompat } from '../../types';
export declare class OpenChannelCreateParamsProperties {
    channelUrl?: string;
    name?: string;
    coverUrlOrImage?: FileCompat | string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
}
export default class OpenChannelCreateParams extends OpenChannelCreateParamsProperties {
    constructor(props?: OpenChannelCreateParamsProperties);
    validate(): boolean;
}
