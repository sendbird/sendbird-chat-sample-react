export declare class GroupChannelChangeLogsParamsProperties {
    customTypes?: string[];
    includeEmpty?: boolean;
    includeFrozen?: boolean;
}
export default class GroupChannelChangeLogsParams extends GroupChannelChangeLogsParamsProperties {
    constructor(props?: GroupChannelChangeLogsParamsProperties);
    validate(): boolean;
}
