"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelSearchField = exports.QueryType = exports.HiddenChannelFilter = exports.UnreadChannelFilter = exports.SuperChannelFilter = exports.MemberStateFilter = exports.PublicChannelFilter = void 0;
var PublicChannelFilter;
(function (PublicChannelFilter) {
    PublicChannelFilter["ALL"] = "all";
    PublicChannelFilter["PUBLIC"] = "public";
    PublicChannelFilter["PRIVATE"] = "private";
})(PublicChannelFilter = exports.PublicChannelFilter || (exports.PublicChannelFilter = {}));
var MemberStateFilter;
(function (MemberStateFilter) {
    MemberStateFilter["ALL"] = "all";
    MemberStateFilter["JOINED"] = "joined_only";
    MemberStateFilter["INVITED"] = "invited_only";
    MemberStateFilter["INVITED_BY_FRIEND"] = "invited_by_friend";
    MemberStateFilter["INVITED_BY_NON_FRIEND"] = "invited_by_non_friend";
})(MemberStateFilter = exports.MemberStateFilter || (exports.MemberStateFilter = {}));
var SuperChannelFilter;
(function (SuperChannelFilter) {
    SuperChannelFilter["ALL"] = "all";
    SuperChannelFilter["SUPER"] = "super";
    SuperChannelFilter["NON_SUPER"] = "nonsuper";
    SuperChannelFilter["BROADCAST_ONLY"] = "broadcast_only";
})(SuperChannelFilter = exports.SuperChannelFilter || (exports.SuperChannelFilter = {}));
var UnreadChannelFilter;
(function (UnreadChannelFilter) {
    UnreadChannelFilter["ALL"] = "all";
    UnreadChannelFilter["UNREAD_MESSAGE"] = "unread_message";
})(UnreadChannelFilter = exports.UnreadChannelFilter || (exports.UnreadChannelFilter = {}));
var HiddenChannelFilter;
(function (HiddenChannelFilter) {
    HiddenChannelFilter["UNHIDDEN"] = "unhidden_only";
    HiddenChannelFilter["HIDDEN"] = "hidden_only";
    HiddenChannelFilter["HIDDEN_ALLOW_AUTO_UNHIDE"] = "hidden_allow_auto_unhide";
    HiddenChannelFilter["HIDDEN_PREVENT_AUTO_UNHIDE"] = "hidden_prevent_auto_unhide";
})(HiddenChannelFilter = exports.HiddenChannelFilter || (exports.HiddenChannelFilter = {}));
var QueryType;
(function (QueryType) {
    QueryType["AND"] = "AND";
    QueryType["OR"] = "OR";
})(QueryType = exports.QueryType || (exports.QueryType = {}));
var GroupChannelSearchField;
(function (GroupChannelSearchField) {
    GroupChannelSearchField["MEMBER_NICKNAME"] = "member_nickname";
    GroupChannelSearchField["CHANNEL_NAME"] = "channel_name";
})(GroupChannelSearchField = exports.GroupChannelSearchField || (exports.GroupChannelSearchField = {}));
//# sourceMappingURL=groupChannelFilter.js.map