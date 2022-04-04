import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand from '../../../core/command/api/apiResponseCommand';
import { SendUserMessageRequestParams } from './userMessageCommand';
import ScheduledUserMessage, { ScheduledUserMessagePayload } from '../../../model/message/scheduledUserMessage';
import { MentionType } from '../../../model/message/types';
import { AppleCriticalAlertOptionsPayload } from '../../../model/message/appleCriticalAlertOptions';
import { MessageMetaArrayPayload } from '../../../model/message/messageMetaArray';
/**
 * @internal
 */
export interface RegisterScheduledUserMessageRequestCommandParams extends SendUserMessageRequestParams {
    userId: string;
    scheduleDatetime: string;
}
interface RegisterScheduledUserMessageRequestCommandPayload {
    message_type: string;
    user_id: string;
    message: string;
    mention_type: MentionType;
    mentioned_user_ids: string[];
    data?: string;
    custom_type?: string;
    translation_target_langs?: string[];
    sorted_metaarray?: MessageMetaArrayPayload[];
    push_option?: string;
    parent_message_id?: number;
    apple_critical_alert_options?: AppleCriticalAlertOptionsPayload;
    poll_id?: number;
    reply_to_channel?: boolean;
    scheduled_dt: string;
}
interface RegisterScheduledUserMessageResponseCommandPayload extends ScheduledUserMessagePayload {
}
/**
 * @internal
 */
export declare class RegisterScheduledUserMessageRequestCommand extends APIRequestCommand {
    params: RegisterScheduledUserMessageRequestCommandPayload;
    constructor(params: RegisterScheduledUserMessageRequestCommandParams);
}
/**
 * @internal
 */
export declare class RegisterScheduledUserMessageResponseCommand extends APIResponseCommand {
    readonly message: ScheduledUserMessage;
    constructor(_iid: string, payload: RegisterScheduledUserMessageResponseCommandPayload);
}
export {};
