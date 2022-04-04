export declare enum MessageType {
    BASE = "base",
    USER = "user",
    FILE = "file",
    ADMIN = "admin"
}
export declare enum MessageTypeFilter {
    ALL = "",
    USER = "MESG",
    FILE = "FILE",
    ADMIN = "ADMM"
}
export declare enum MentionType {
    USERS = "users",
    CHANNEL = "channel"
}
export declare enum ReplyType {
    ALL = "all",
    NONE = "none",
    ONLY_REPLY_TO_CHANNEL = "only_reply_to_channel"
}
export declare enum PushNotificationDeliveryOption {
    DEFAULT = "default",
    SUPPRESS = "suppress"
}
export declare enum RequestState {
    PENDING = "pending",
    FAILED = "failed",
    CANCELED = "canceled",
    SUCCEEDED = "succeeded"
}
