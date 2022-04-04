import { MemberStateFilter } from '../channel/groupChannelFilter';
export declare class GroupChannelCountParamsProperties {
    memberStateFilter?: MemberStateFilter;
}
export default class GroupChannelCountParams extends GroupChannelCountParamsProperties {
    constructor(props?: GroupChannelCountParamsProperties);
    validate(): boolean;
}
