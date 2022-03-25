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
const instancedObject_1 = require("../model/instancedObject");
class OpenChannelCache extends instancedObject_1.default {
    constructor() {
        super(...arguments);
        this._channels = new Map();
        this._enteredChannelUrls = [];
    }
    get enteredChannels() {
        return this._enteredChannelUrls
            .map((url) => this._channels.get(url))
            .filter((channel) => channel !== null);
    }
    isEnteredChannel(channelUrl) {
        return this._enteredChannelUrls.includes(channelUrl);
    }
    enter(channelUrl) {
        const index = this._enteredChannelUrls.indexOf(channelUrl);
        if (index < 0)
            this._enteredChannelUrls.push(channelUrl);
    }
    exit(channelUrl) {
        const index = this._enteredChannelUrls.indexOf(channelUrl);
        if (index >= 0)
            this._enteredChannelUrls.splice(index, 1);
    }
    exitAll() {
        this._enteredChannelUrls = [];
    }
    get(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._channels.get(channelUrl);
        });
    }
    upsert(channels) {
        return __awaiter(this, void 0, void 0, function* () {
            channels.forEach((channel) => {
                if (this._channels.has(channel.url)) {
                    const originalChannel = this._channels.get(channel.url);
                    Object.assign(originalChannel, channel);
                }
                else
                    this._channels.set(channel.url, channel);
            });
        });
    }
    remove(channelUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            this._channels.delete(channelUrl);
            this.exit(channelUrl);
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this._channels.clear();
            this._enteredChannelUrls = [];
        });
    }
}
exports.default = OpenChannelCache;
//# sourceMappingURL=openChannelCache.js.map