"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageIndexBy = exports.MessageListOrder = void 0;
var MessageListOrder;
(function (MessageListOrder) {
    MessageListOrder["CHANNEL_LATEST"] = "channel_latest";
})(MessageListOrder = exports.MessageListOrder || (exports.MessageListOrder = {}));
const getMessageIndexBy = (order) => {
    switch (order) {
        case MessageListOrder.CHANNEL_LATEST: return ['channelUrl', '-createdAt', '-messageId'];
    }
};
exports.getMessageIndexBy = getMessageIndexBy;
//# sourceMappingURL=messageListOrder.js.map