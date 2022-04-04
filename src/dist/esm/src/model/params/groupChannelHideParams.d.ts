export declare class GroupChannelHideParamsProperties {
    hidePreviousMessages?: boolean;
    allowAutoUnhide?: boolean;
}
export default class GroupChannelHideParams extends GroupChannelHideParamsProperties {
    constructor(props?: GroupChannelHideParamsProperties);
    validate(): boolean;
}
