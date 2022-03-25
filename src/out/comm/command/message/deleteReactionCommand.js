"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteReactionResponseCommand = exports.DeleteReactionRequestCommand = void 0;
const apiRequestCommand_1 = require("../../../core/command/api/apiRequestCommand");
const apiResponseCommand_1 = require("../../../core/command/api/apiResponseCommand");
const message_1 = require("../../../module/message");
const utils_1 = require("../utils");
class DeleteReactionRequestCommand extends apiRequestCommand_1.default {
    constructor({ channelType, channelUrl, messageId, reactionKey }) {
        super();
        this.method = apiRequestCommand_1.APIRequestMethod.DELETE;
        this.path = `${(0, utils_1.getChannelApiPathByType)(channelType)}/${encodeURIComponent(channelUrl)}/messages/${messageId}/reactions`;
        this.params = {
            reaction: reactionKey,
        };
    }
}
exports.DeleteReactionRequestCommand = DeleteReactionRequestCommand;
class DeleteReactionResponseCommand extends apiResponseCommand_1.default {
    constructor(_iid, payload) {
        super(_iid, payload);
        this.reactionEvent = new message_1.ReactionEvent(Object.assign({}, payload));
    }
}
exports.DeleteReactionResponseCommand = DeleteReactionResponseCommand;
//# sourceMappingURL=deleteReactionCommand.js.map