import { SuperChannelFilter } from '../channel/groupChannelFilter';
export declare class TotalUnreadMessageCountParamsProperties {
    channelCustomTypesFilter?: string[];
    superChannelFilter?: SuperChannelFilter;
}
export default class TotalUnreadMessageCountParams extends TotalUnreadMessageCountParamsProperties {
    constructor(props?: TotalUnreadMessageCountParamsProperties);
    validate(): boolean;
}
