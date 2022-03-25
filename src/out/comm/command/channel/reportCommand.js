"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportMessageCommand = exports.ReportUserCommand = exports.ReportChannelCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const types_1 = require("../../../model/channel/types");
const utils_1 = require("../utils");
class ReportChannelCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, category, userId, description, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getReportApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}`;
        this.params = {
            report_category: category,
            reporting_user_id: userId,
            report_description: description,
        };
    }
}
exports.ReportChannelCommand = ReportChannelCommand;
class ReportUserCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, category, userId, offendingUserId, description, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `/report/users/${offendingUserId}`;
        this.params = {
            channel_url: channelUrl,
            channel_type: channelType === types_1.ChannelType.OPEN ? 'open_channels' : 'group_channels',
            report_category: category,
            reporting_user_id: userId,
            report_description: description,
        };
    }
}
exports.ReportUserCommand = ReportUserCommand;
class ReportMessageCommand extends apiRequestCommand_1.default {
    constructor(params) {
        const { channelUrl, channelType, category, userId, offendingUserId, messageId, description, } = params;
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.POST;
        this.path = `${(0, utils_1.getReportApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/messages/${messageId}`;
        this.params = {
            report_category: category,
            reporting_user_id: userId,
            report_description: description,
            offending_user_id: offendingUserId,
        };
    }
}
exports.ReportMessageCommand = ReportMessageCommand;
//# sourceMappingURL=reportCommand.js.map