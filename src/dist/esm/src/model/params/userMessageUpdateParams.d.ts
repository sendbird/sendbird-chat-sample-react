import { BaseMessageUpdateParamsProperties } from './baseMessageUpdateParams';
export declare class UserMessageUpdateParamsProperties extends BaseMessageUpdateParamsProperties {
    message?: string;
}
export default class UserMessageUpdateParams extends UserMessageUpdateParamsProperties {
    constructor(props?: UserMessageUpdateParamsProperties);
    validate(): boolean;
}
