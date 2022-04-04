import { FileCompat } from '../../types';
export declare class OpenChannelUpdateParamsProperties {
    name?: string;
    coverUrlOrImage?: FileCompat | string;
    data?: string;
    customType?: string;
    operatorUserIds?: string[];
}
export default class OpenChannelUpdateParams extends OpenChannelUpdateParamsProperties {
    constructor(props?: OpenChannelUpdateParamsProperties);
    validate(): boolean;
}
