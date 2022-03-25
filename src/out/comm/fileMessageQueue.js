"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const stateType_1 = require("./connectionManager/stateType");
const connectionStateChangeCommand_1 = require("./command/internal/connectionStateChangeCommand");
const uploadFileCommand_1 = require("./command/message/uploadFileCommand");
const fileMessageCommand_1 = require("./command/message/fileMessageCommand");
const deferred_1 = require("../utils/deferred");
const validator_1 = require("../utils/validator");
const sleep_1 = require("../utils/sleep");
const SEND_MESSAGE_TERM = 100;
const MAX_FILE_UPLOAD_POOL_SIZE = 5;
var FileMessageState;
(function (FileMessageState) {
    FileMessageState[FileMessageState["PENDING"] = 0] = "PENDING";
    FileMessageState[FileMessageState["UPLOADING"] = 1] = "UPLOADING";
    FileMessageState[FileMessageState["UPLOADED"] = 2] = "UPLOADED";
    FileMessageState[FileMessageState["SENDING"] = 3] = "SENDING";
    FileMessageState[FileMessageState["FAILED"] = 4] = "FAILED";
})(FileMessageState || (FileMessageState = {}));
class FileMessageQueue {
    constructor({ sdkState, dispatcher, requestQueue }) {
        this._queueMap = new Map();
        this._isConnected = false;
        this._sdkState = sdkState;
        this._requestQueue = requestQueue;
        this._dispatcher = dispatcher;
        this._dispatcher.on((command) => {
            if (command instanceof connectionStateChangeCommand_1.default) {
                switch (command.stateType) {
                    case stateType_1.ConnectionStateType.CONNECTED:
                        this._isConnected = true;
                        break;
                    default:
                        this._isConnected = false;
                }
            }
        });
    }
    _sendFileMessage(channel, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isConnected) {
                const request = new fileMessageCommand_1.SendFileMessageRequestCommand(Object.assign(Object.assign({ channelUrl: channel.url, channelType: channel.channelType, url: item.params.file, requireAuth: item.requireAuth }, item.params), { reqId: item.requestId }));
                const response = yield this._requestQueue.send(request);
                const { message } = response.as(fileMessageCommand_1.FileMessageEventCommand);
                return message;
            }
            else {
                const request = new fileMessageCommand_1.SendFileMessageAPIRequestCommand(Object.assign(Object.assign({ channelUrl: channel.url, channelType: channel.channelType, url: item.params.file, userId: this._sdkState.userId, requireAuth: item.requireAuth }, item.params), { reqId: item.requestId }));
                const response = yield this._requestQueue.send(request);
                const { message } = response.as(fileMessageCommand_1.SendFileMessageAPIResponseCommand);
                return message;
            }
        });
    }
    _resolveMessageQueue(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this._queueMap.get(channel.url);
            if (container) {
                if (!container.isResolving) {
                    container.isResolving = true;
                    const resolvedMessageQueue = [];
                    let arePreviousRequestsReadyToSend = true;
                    for (const item of container.messageQueue) {
                        switch (item.state) {
                            case FileMessageState.PENDING:
                            case FileMessageState.UPLOADING: {
                                arePreviousRequestsReadyToSend = false;
                                resolvedMessageQueue.push(item);
                                break;
                            }
                            case FileMessageState.UPLOADED: {
                                if (arePreviousRequestsReadyToSend) {
                                    try {
                                        item.state = FileMessageState.SENDING;
                                        const message = yield this._sendFileMessage(channel, item);
                                        item.deferred.resolve(message);
                                        yield (0, sleep_1.sleep)(SEND_MESSAGE_TERM);
                                    }
                                    catch (err) {
                                        item.deferred.reject(err);
                                    }
                                }
                                else {
                                    resolvedMessageQueue.push(item);
                                }
                                break;
                            }
                            case FileMessageState.FAILED: {
                                item.deferred.reject(item.error.code === error_1.SendbirdErrorCode.REQUEST_CANCELED ?
                                    error_1.default.fileUploadCanceled : item.error);
                                break;
                            }
                        }
                    }
                    const wasResolveRequestPending = container.isResolveRequestPending;
                    container.messageQueue = resolvedMessageQueue;
                    container.isResolving = false;
                    container.isResolveRequestPending = false;
                    if (wasResolveRequestPending)
                        yield this._resolveMessageQueue(channel);
                }
                else {
                    container.isResolveRequestPending = true;
                }
            }
        });
    }
    _uploadNextPendingItem(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this._queueMap.get(channel.url);
            const nextItem = container.messageQueue.find((item) => item.state === FileMessageState.PENDING);
            if (nextItem) {
                if ((0, validator_1.isFile)(nextItem.params.file)) {
                    if (container.uploadQueue.length < MAX_FILE_UPLOAD_POOL_SIZE + 1) {
                        nextItem.state = FileMessageState.UPLOADING;
                        container.uploadQueue.push(nextItem);
                        try {
                            const request = new uploadFileCommand_1.UploadFileRequestCommand({
                                file: nextItem.params.file,
                                channelUrl: channel.url,
                                thumbnailSizes: nextItem.params.thumbnailSizes,
                                requestId: nextItem.requestId,
                            });
                            const response = yield this._requestQueue.send(request);
                            const { url, fileSize = nextItem.params.fileSize, thumbnailSizes = nextItem.params.thumbnailSizes, requireAuth = false, } = response.as(uploadFileCommand_1.UploadFileResponseCommand);
                            nextItem.params.fileUrl = url;
                            nextItem.params.fileSize = fileSize;
                            nextItem.params.thumbnailSizes = thumbnailSizes;
                            nextItem.requireAuth = requireAuth;
                            nextItem.state = FileMessageState.UPLOADED;
                        }
                        catch (err) {
                            nextItem.state = FileMessageState.FAILED;
                            nextItem.error = err;
                        }
                        finally {
                            const uploadQueueIndex = container.uploadQueue.findIndex((item) => item.requestId === nextItem.requestId);
                            if (uploadQueueIndex >= 0) {
                                container.uploadQueue.splice(uploadQueueIndex, 1);
                                this._uploadNextPendingItem(channel);
                            }
                            yield this._resolveMessageQueue(channel);
                        }
                    }
                }
                else {
                    nextItem.params.thumbnailSizes = [];
                    nextItem.state = FileMessageState.UPLOADED;
                    yield this._resolveMessageQueue(channel);
                }
            }
        });
    }
    request(channel, requestId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const deferred = new deferred_1.Deferred();
            if (!this._queueMap.has(channel.url)) {
                this._queueMap.set(channel.url, {
                    messageQueue: [],
                    uploadQueue: [],
                    isResolving: false,
                    isResolveRequestPending: false,
                });
            }
            const container = this._queueMap.get(channel.url);
            container.messageQueue.push({
                requestId,
                params,
                state: FileMessageState.PENDING,
                deferred,
            });
            this._uploadNextPendingItem(channel);
            return deferred.promise;
        });
    }
    cancel(channel, requestId = null) {
        const container = this._queueMap.get(channel.url);
        if (container) {
            const targetItems = requestId ?
                [container.messageQueue.find((item) => item.requestId === requestId)] :
                [...container.messageQueue];
            for (const item of targetItems) {
                if (item) {
                    switch (item.state) {
                        case FileMessageState.PENDING: {
                            item.state = FileMessageState.FAILED;
                            item.error = error_1.default.requestCanceled;
                            this._resolveMessageQueue(channel);
                            break;
                        }
                        case FileMessageState.UPLOADING: {
                            this._requestQueue.cancel(item.requestId);
                            break;
                        }
                    }
                }
            }
        }
    }
}
exports.default = FileMessageQueue;
//# sourceMappingURL=fileMessageQueue.js.map