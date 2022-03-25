"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOfMessage = exports.indexOfMessage = void 0;
const indexOfMessage = (messages, messageToFind) => {
    return messages.findIndex((message) => message.isIdentical(messageToFind));
};
exports.indexOfMessage = indexOfMessage;
const placeOfMessage = (messages, messageToFind) => {
    if (messages.length > 0) {
        let start = 0;
        let end = messages.length - 1;
        let pivot = Math.floor((start + end) / 2);
        while (start < end) {
            const compared = messages[pivot].createdAt - messageToFind.createdAt;
            if (compared > 0) {
                end = pivot;
                pivot = Math.floor((start + end) / 2);
            }
            else if (compared < 0) {
                start = pivot + 1;
                pivot = Math.floor((start + end) / 2);
            }
            else
                return pivot;
        }
        return messages[pivot].createdAt > messageToFind.createdAt ? pivot : pivot + 1;
    }
    return messages.length;
};
exports.placeOfMessage = placeOfMessage;
//# sourceMappingURL=utils.js.map