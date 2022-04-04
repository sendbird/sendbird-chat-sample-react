import { UnreadItemKey } from '../channel/groupChannel';
export declare class UnreadItemCountParamsProperties {
    keys: UnreadItemKey[];
}
export default class UnreadItemCountParams extends UnreadItemCountParamsProperties {
    constructor(props?: UnreadItemCountParamsProperties);
    validate(): boolean;
}
