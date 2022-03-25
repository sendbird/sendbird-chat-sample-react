"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberCountUpdateEventCommand = void 0;
const websocketEventCommand_1 = require("../../../core/command/websocket/websocketEventCommand");
class MemberCountUpdateEventCommand extends websocketEventCommand_1.default {
    constructor(_iid, _, payload) {
        super(_iid, 'MCNT', payload);
        this.groupChannelMemberCounts = payload.group_channels.map((payload) => {
            return {
                channelUrl: payload.channel_url,
                memberCount: payload.member_count,
                joinedMemberCount: payload.joined_member_count,
                updatedAt: payload.ts,
            };
        });
        this.openChannelMemberCounts = payload.open_channels.map((payload) => {
            return {
                channelUrl: payload.channel_url,
                participantCount: payload.participant_count,
                updatedAt: payload.ts,
            };
        });
    }
}
exports.MemberCountUpdateEventCommand = MemberCountUpdateEventCommand;
//# sourceMappingURL=memberCountUpdateEventCommand.js.map