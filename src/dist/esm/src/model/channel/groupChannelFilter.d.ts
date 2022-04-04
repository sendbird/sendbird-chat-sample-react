export declare enum PublicChannelFilter {
    ALL = "all",
    PUBLIC = "public",
    PRIVATE = "private"
}
export declare enum MemberStateFilter {
    ALL = "all",
    JOINED = "joined_only",
    INVITED = "invited_only",
    INVITED_BY_FRIEND = "invited_by_friend",
    INVITED_BY_NON_FRIEND = "invited_by_non_friend"
}
export declare enum SuperChannelFilter {
    ALL = "all",
    SUPER = "super",
    NON_SUPER = "nonsuper",
    BROADCAST_ONLY = "broadcast_only"
}
export declare enum UnreadChannelFilter {
    ALL = "all",
    UNREAD_MESSAGE = "unread_message"
}
export declare enum HiddenChannelFilter {
    UNHIDDEN = "unhidden_only",
    HIDDEN = "hidden_only",
    HIDDEN_ALLOW_AUTO_UNHIDE = "hidden_allow_auto_unhide",
    HIDDEN_PREVENT_AUTO_UNHIDE = "hidden_prevent_auto_unhide"
}
export declare enum OperatorFilter {
    ALL = "all",
    OPERATOR = "operator",
    NONOPERATOR = "nonoperator"
}
export declare enum QueryType {
    AND = "AND",
    OR = "OR"
}
export declare enum GroupChannelSearchField {
    MEMBER_NICKNAME = "member_nickname",
    CHANNEL_NAME = "channel_name"
}
export interface GroupChannelSearchFilter {
    query?: string;
    fields?: GroupChannelSearchField[];
}
export interface GroupChannelUserIdsFilter {
    userIds: string[];
    includeMode: boolean;
    queryType: QueryType;
}
