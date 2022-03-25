"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const groupChannelFilter_1 = require("../model/channel/groupChannelFilter");
const validator_1 = require("../utils/validator");
class GroupChannelFilter {
    constructor() {
        this._searchFilter = {};
        this._userIdsFilter = {
            userIds: [],
            includeMode: true,
            queryType: groupChannelFilter_1.QueryType.AND,
        };
        this.includeEmpty = false;
        this.nicknameContainsFilter = '';
        this.channelNameContainsFilter = '';
        this.memberStateFilter = groupChannelFilter_1.MemberStateFilter.ALL;
        this.customTypesFilter = [];
        this.channelUrlsFilter = [];
        this.superChannelFilter = groupChannelFilter_1.SuperChannelFilter.ALL;
        this.publicChannelFilter = groupChannelFilter_1.PublicChannelFilter.ALL;
        this.customTypeStartsWithFilter = null;
        this.unreadChannelFilter = groupChannelFilter_1.UnreadChannelFilter.ALL;
        this.hiddenChannelFilter = groupChannelFilter_1.HiddenChannelFilter.UNHIDDEN;
        this.includeFrozen = true;
    }
    _isFriend(user) {
        return !!user.friendDiscoveryKey || !!user.friendName;
    }
    get searchFilter() {
        return this._searchFilter;
    }
    setSearchFilter(fields, query) {
        if (Array.isArray(fields) && fields.length !== 0 && typeof query === 'string' && query) {
            this._searchFilter = {
                query,
                fields: fields,
            };
        }
    }
    get userIdsFilter() {
        return this._userIdsFilter;
    }
    setUserIdsFilter(userIds, includeMode, queryType = groupChannelFilter_1.QueryType.AND) {
        this._userIdsFilter = {
            userIds,
            includeMode,
            queryType,
        };
    }
    clone() {
        const filter = new GroupChannelFilter();
        filter.setSearchFilter(this.searchFilter.fields, this.searchFilter.query);
        filter.setUserIdsFilter(this.userIdsFilter.userIds, this.userIdsFilter.includeMode, this.userIdsFilter.queryType);
        const cloned = JSON.parse(JSON.stringify(this));
        Object.keys(cloned).forEach((key) => {
            filter[key] = cloned[key];
        });
        return filter;
    }
    match(channel, currentUserId) {
        const searchFilter = this._searchFilter;
        const { query, fields } = searchFilter;
        if (query && fields && fields.length > 0) {
            if (!fields.some((searchField) => {
                switch (searchField) {
                    case groupChannelFilter_1.GroupChannelSearchField.CHANNEL_NAME: {
                        return channel.name.toLowerCase().includes(query.toLowerCase());
                    }
                    case groupChannelFilter_1.GroupChannelSearchField.MEMBER_NICKNAME: {
                        return channel.members.some((member) => member.nickname.toLowerCase().includes(query.toLowerCase()));
                    }
                    default:
                        return true;
                }
            })) {
                return false;
            }
        }
        const userIdsFilter = this._userIdsFilter;
        const { userIds, includeMode, queryType } = userIdsFilter;
        const memberIds = channel.members.map((member) => member.userId);
        if (!includeMode) {
            if (!userIds.includes(currentUserId))
                userIds.push(currentUserId);
            if (channel.members.length > userIds.length)
                return false;
            if (!(0, validator_1.hasSameMembers)(userIds, memberIds))
                return false;
        }
        else if (userIds.length > 0) {
            switch (queryType) {
                case groupChannelFilter_1.QueryType.AND:
                    if (userIds.some((userId) => !memberIds.includes(userId)))
                        return false;
                    break;
                case groupChannelFilter_1.QueryType.OR:
                    if (userIds.every((userId) => !memberIds.includes(userId)))
                        return false;
                    break;
            }
        }
        if (!this.includeEmpty && !channel.lastMessage)
            return false;
        if (!this.includeFrozen && channel.isFrozen)
            return false;
        if (this.customTypesFilter.length > 0 && !this.customTypesFilter.includes(channel.customType))
            return false;
        if (this.customTypeStartsWithFilter && !new RegExp(`^${this.customTypeStartsWithFilter}`).test(channel.customType))
            return false;
        if (this.channelNameContainsFilter && !channel.name.toLowerCase().includes(this.channelNameContainsFilter.toLowerCase()))
            return false;
        if (this.nicknameContainsFilter) {
            const lowerCasedSubString = this.nicknameContainsFilter.toLowerCase();
            if (channel.members.every((member) => !member.nickname.toLowerCase().includes(lowerCasedSubString)))
                return false;
        }
        if (this.channelUrlsFilter.length > 0 && !this.channelUrlsFilter.includes(channel.url))
            return false;
        if (this.memberStateFilter) {
            switch (this.memberStateFilter) {
                case groupChannelFilter_1.MemberStateFilter.JOINED:
                    if (channel.myMemberState !== 'joined')
                        return false;
                    break;
                case groupChannelFilter_1.MemberStateFilter.INVITED:
                    if (channel.myMemberState !== 'invited')
                        return false;
                    break;
                case groupChannelFilter_1.MemberStateFilter.INVITED_BY_FRIEND:
                    if (channel.myMemberState !== 'invited' || !this._isFriend(channel.inviter))
                        return false;
                    break;
                case groupChannelFilter_1.MemberStateFilter.INVITED_BY_NON_FRIEND:
                    if (channel.myMemberState !== 'invited' || this._isFriend(channel.inviter))
                        return false;
                    break;
            }
        }
        if (this.hiddenChannelFilter) {
            switch (this.hiddenChannelFilter) {
                case groupChannelFilter_1.HiddenChannelFilter.UNHIDDEN:
                    if (channel.isHidden || channel.hiddenState !== 'unhidden')
                        return false;
                    break;
                case groupChannelFilter_1.HiddenChannelFilter.HIDDEN:
                    if (!channel.isHidden)
                        return false;
                    break;
                case groupChannelFilter_1.HiddenChannelFilter.HIDDEN_ALLOW_AUTO_UNHIDE:
                    if (!channel.isHidden || channel.hiddenState !== 'hidden_allow_auto_unhide')
                        return false;
                    break;
                case groupChannelFilter_1.HiddenChannelFilter.HIDDEN_PREVENT_AUTO_UNHIDE:
                    if (!channel.isHidden || channel.hiddenState !== 'hidden_prevent_auto_unhide')
                        return false;
                    break;
            }
        }
        if (this.unreadChannelFilter) {
            switch (this.unreadChannelFilter) {
                case groupChannelFilter_1.UnreadChannelFilter.UNREAD_MESSAGE:
                    if (channel.unreadMessageCount === 0)
                        return false;
                    break;
            }
        }
        if (this.publicChannelFilter) {
            switch (this.publicChannelFilter) {
                case groupChannelFilter_1.PublicChannelFilter.PUBLIC:
                    if (!channel.isPublic)
                        return false;
                    break;
                case groupChannelFilter_1.PublicChannelFilter.PRIVATE:
                    if (channel.isPublic)
                        return false;
                    break;
            }
        }
        if (this.superChannelFilter) {
            switch (this.superChannelFilter) {
                case groupChannelFilter_1.SuperChannelFilter.SUPER:
                    if (!channel.isSuper)
                        return false;
                    break;
                case groupChannelFilter_1.SuperChannelFilter.NON_SUPER:
                    if (channel.isSuper)
                        return false;
                    break;
            }
        }
        return true;
    }
}
exports.default = GroupChannelFilter;
//# sourceMappingURL=groupChannelFilter.js.map