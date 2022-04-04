import MessageMetaArray from '../message/messageMetaArray';
import AppleCriticalAlertOptions from '../message/appleCriticalAlertOptions';
import { MentionType, PushNotificationDeliveryOption } from '../message/types';
export declare class BaseMessageParamsProperties {
    data?: string;
    customType?: string;
    mentionType?: MentionType;
    mentionedUserIds?: string[];
    metaArrays?: MessageMetaArray[];
    parentMessageId?: number;
    isReplyToChannel?: boolean;
    pushNotificationDeliveryOption?: PushNotificationDeliveryOption;
    appleCriticalAlertOptions?: AppleCriticalAlertOptions;
}
export default class BaseMessageParams extends BaseMessageParamsProperties {
    constructor(props?: BaseMessageParamsProperties);
    validate(): boolean;
}
