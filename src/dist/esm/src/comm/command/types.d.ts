/**
 * @internal
 */
export declare type SortFieldPayload = 'score' | 'ts';
/**
 * @internal
 */
export declare type PushTemplatePayload = 'default' | 'alternative';
/**
 * @internal
 */
export declare type PushTokenTypePayload = 'GCM' | 'HUAWEI' | 'APNS';
/**
 * @internal
 */
export declare type PushTriggerOptionPayload = 'default' | 'all' | 'mention_only' | 'off';
/**
 * @internal
 */
export interface PushPreferencePayload {
    snooze_start_ts: string;
    start_hour: number;
    snooze_enabled: boolean;
    end_min: number;
    timezone: string;
    block_push_from_bots: boolean;
    push_blocked_bot_ids: string[];
    start_min: number;
    snooze_end_ts: string;
    do_not_disturb: boolean;
    end_hour: number;
    enable_push_for_replies: boolean;
    push_sound: string;
    push_trigger_option: PushTriggerOptionPayload;
}
/**
 * @internal
 */
export interface MyPushPreferencePayload {
    push_trigger_option: PushTriggerOptionPayload;
    push_sound: string;
    enable: boolean;
}
/**
 * @internal
 */
export declare type CountPreferencePayload = 'all' | 'unread_message_count_only' | 'unread_mention_count_only' | 'off';
/**
 * @internal
 */
export interface DeletedMessagePayload {
    deleted_at: number;
    message_id: number;
}
/**
 * @internal
 */
export interface DeletedMessageInfo {
    deletedAt: number;
    messageId: number;
}
/**
 * @internal
 */
export declare type ReplyTypePayload = 'all' | 'none' | 'only_reply_to_channel';
/**
 * @internal
 */
export declare type MentionTypePayload = 'channel' | 'users';
/**
 * @internal
 */
export declare type ReportCategoryPayload = 'spam' | 'harassing' | 'suspicious' | 'inappropriate';
/**
 * @internal
 */
export declare type ReportTypePayload = 'message';
/**
 * @internal
 */
export declare enum ReportType {
    MESSAGE = "message"
}
/**
 * @internal
 */
export declare type ReactionOperationPayload = 'ADD' | 'DELETE';
/**
 * @internal
 */
export interface ReactionPayload {
    reaction: string;
    user_id: string;
    success: boolean;
    msg_id: number;
    updated_at: number;
    operation: ReactionOperationPayload;
}
