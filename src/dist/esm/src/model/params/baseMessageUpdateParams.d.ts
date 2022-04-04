import AppleCriticalAlertOptions from '../message/appleCriticalAlertOptions';
import { MentionType } from '../message/types';
export declare class BaseMessageUpdateParamsProperties {
    data?: string;
    customType?: string;
    mentionType?: MentionType;
    mentionedUserIds?: string[];
    appleCriticalAlertOptions?: AppleCriticalAlertOptions;
}
export default class BaseMessageUpdateParams extends BaseMessageUpdateParamsProperties {
    constructor(props?: BaseMessageUpdateParamsProperties);
    validate(): boolean;
}
