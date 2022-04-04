import { BaseMessageUpdateParamsProperties } from './baseMessageUpdateParams';
export declare class FileMessageUpdateParamsProperties extends BaseMessageUpdateParamsProperties {
}
export default class FileMessageUpdateParams extends FileMessageUpdateParamsProperties {
    constructor(props?: FileMessageUpdateParamsProperties);
    validate(): boolean;
}
