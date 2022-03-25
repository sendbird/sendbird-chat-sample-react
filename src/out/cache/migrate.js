"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = void 0;
const const_1 = require("./const");
const groupChannelListOrder_1 = require("../model/channel/groupChannelListOrder");
const unsentMessageCache_1 = require("./unsentMessageCache");
const messageListOrder_1 = require("../model/message/messageListOrder");
const pollCache_1 = require("./pollCache");
const migrate = (nestdb) => {
    return (oldVersion, next) => {
        switch (oldVersion) {
            case 0: {
                nestdb.commitSchema([
                    {
                        collectionName: const_1.NESTDB_GROUPCHANNEL_COLLECTION_NAME,
                        keyName: const_1.NESTDB_GROUPCHANNEL_COLLECTION_KEY,
                        index: [
                            (0, groupChannelListOrder_1.getGroupChannelIndexBy)(groupChannelListOrder_1.GroupChannelListOrder.LATEST_LAST_MESSAGE),
                            (0, groupChannelListOrder_1.getGroupChannelIndexBy)(groupChannelListOrder_1.GroupChannelListOrder.CHRONOLOGICAL),
                            (0, groupChannelListOrder_1.getGroupChannelIndexBy)(groupChannelListOrder_1.GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL),
                        ],
                    },
                    {
                        collectionName: const_1.NESTDB_MESSAGE_COLLECTION_NAME,
                        keyName: const_1.NESTDB_MESSAGE_COLLECTION_KEY,
                        index: [
                            (0, messageListOrder_1.getMessageIndexBy)(messageListOrder_1.MessageListOrder.CHANNEL_LATEST),
                        ],
                    },
                    {
                        collectionName: unsentMessageCache_1.NESTDB_UNSENT_MESSAGE_COLLECTION_NAME,
                        keyName: unsentMessageCache_1.NESTDB_UNSENT_MESSAGE_COLLECTION_KEY,
                        index: [
                            (0, messageListOrder_1.getMessageIndexBy)(messageListOrder_1.MessageListOrder.CHANNEL_LATEST),
                        ],
                    },
                    {
                        collectionName: pollCache_1.NESTDB_POLL_COLLECTION_NAME,
                        keyName: pollCache_1.NESTDB_POLL_COLLECTION_KEY,
                    },
                ])
                    .then(() => next())
                    .catch((err) => next(err));
                break;
            }
            default:
                next();
        }
    };
};
exports.migrate = migrate;
//# sourceMappingURL=migrate.js.map