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
const groupChannelEventCommand_1 = require("../../comm/command/internal/groupChannelEventCommand");
const databaseOpenCommand_1 = require("../../comm/command/internal/databaseOpenCommand");
const groupChannel_1 = require("../../model/channel/groupChannel");
class GroupChannelBroadcast {
    constructor({ groupChannelCache, messageCache, unsentMessageCache, dispatcher, }) {
        this._observers = new Map();
        dispatcher.on((command) => __awaiter(this, void 0, void 0, function* () {
            if (command instanceof groupChannelEventCommand_1.GroupChannelUpdateEventCommand) {
                const { channels, source } = command;
                const groupChannels = channels.filter((channel) => channel instanceof groupChannel_1.default);
                yield groupChannelCache.upsert(groupChannels);
                this._broadcastUpdateEvent(groupChannels, source);
            }
            else if (command instanceof groupChannelEventCommand_1.GroupChannelRemoveEventCommand) {
                const { channelUrls, source } = command;
                yield groupChannelCache.remove(channelUrls);
                try {
                    for (const channelUrl of channelUrls) {
                        yield messageCache.removeChannel(channelUrl);
                        yield unsentMessageCache.removeChannel(channelUrl);
                    }
                }
                catch (err) { }
                this._broadcastRemoveEvent(channelUrls, source);
            }
            else if (command instanceof databaseOpenCommand_1.default) {
                yield groupChannelCache.fetch({
                    token: Number.MAX_SAFE_INTEGER,
                    limit: Number.MAX_SAFE_INTEGER,
                });
            }
        }));
    }
    _broadcastUpdateEvent(channels, source) {
        for (const observer of this._observers.values()) {
            observer.onUpdate(channels, source);
        }
    }
    _broadcastRemoveEvent(channelUrls, source) {
        for (const observer of this._observers.values()) {
            observer.onRemove(channelUrls, source);
        }
    }
    subscribe(key, observer) {
        debugger;
        this._observers.set(key, observer);
    }
    unsubscribe(key) {
        this._observers.delete(key);
    }
}
exports.default = GroupChannelBroadcast;
//# sourceMappingURL=broadcast.js.map