import InstancedObject, { InstancedObjectPayload } from '../instancedObject';
import User, { UserPayload } from '../user';
import Sender, { SenderPayload } from './sender';
import MessageMetaArray from './messageMetaArray';
import AppleCriticalAlertOptions, { AppleCriticalAlertOptionsPayload } from './appleCriticalAlertOptions';
import { ChannelType } from '../channel/types';
import { MentionType, MessageType, PushNotificationDeliveryOption } from './types';
export declare enum ScheduledStatus {
    SCHEDULED = "scheduled",
    SENT = "sent",
    CANCELED = "canceled",
    FAILED = "failed"
}
/**
 * @internal
 */
export interface ScheduledUserMessagePayload extends InstancedObjectPayload {
    'scheduled_id': number;
    'scheduled_dt'?: string;
    'scheduled_utc_dt'?: string;
    'scheduled_timezone'?: string;
    'status'?: string;
    'channel_url': string;
    'channel_type': string;
    'user': SenderPayload;
    'message': string;
    'custom_type'?: string;
    'data'?: string;
    'mention_type'?: string;
    'mentioned_users'?: UserPayload[];
    'metaarray'?: object;
    'metaarray_key_order'?: string[];
    'translation_target_langs'?: string[];
    'push_option'?: PushNotificationDeliveryOption;
    'apple_critical_alert_options'?: AppleCriticalAlertOptionsPayload;
    'error'?: {
        'code': number;
        'message': string;
    };
    'created_at': number;
    'updated_at': number;
}
export default class ScheduledUserMessage extends InstancedObject {
    scheduleId: number;
    scheduledDateTimeString: string;
    scheduledTimezone: string;
    status: ScheduledStatus;
    readonly channelUrl: string;
    readonly channelType: ChannelType;
    readonly messageType: MessageType;
    readonly sender: Sender;
    message: string;
    customType: string;
    data: string;
    mentionType: MentionType;
    mentionedUsers: User[];
    metaArrays: MessageMetaArray[];
    translationTargetLanguages: string[];
    appleCriticalAlertOptions: AppleCriticalAlertOptions;
    pushNotificationDeliveryOption: PushNotificationDeliveryOption;
    createdAt: number;
    updatedAt: number;
    errorCode: number;
    errorMessage: string;
    /**
     * @private
     */
    constructor(_iid: string, payload: ScheduledUserMessagePayload);
}
