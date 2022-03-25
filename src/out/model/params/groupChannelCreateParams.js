"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupChannelCreateParamsProperties = void 0;
const validator_1 = require("../../utils/validator");
class GroupChannelCreateParamsProperties {
    constructor() {
        this.invitedUserIds = [];
        this.channelUrl = null;
        this.coverUrl = null;
        this.coverImage = null;
        this.isDistinct = null;
        this.isSuper = null;
        this.isBroadcast = null;
        this.isPublic = null;
        this.isDiscoverable = null;
        this.isStrict = null;
        this.isEphemeral = null;
        this.accessCode = null;
        this.name = null;
        this.data = null;
        this.customType = null;
        this.operatorUserIds = [];
        this.messageSurvivalSeconds = null;
    }
}
exports.GroupChannelCreateParamsProperties = GroupChannelCreateParamsProperties;
class GroupChannelCreateParams extends GroupChannelCreateParamsProperties {
    constructor(props) {
        super();
        if (props) {
            for (const key in props) {
                if (this.hasOwnProperty(key)) {
                    this[key] = props[key];
                }
            }
        }
    }
    validate() {
        return ((0, validator_1.isArrayOf)('string', this.invitedUserIds) &&
            ((0, validator_1.isTypeOf)('string', this.channelUrl) || this.channelUrl === null) &&
            ((0, validator_1.isTypeOf)('string', this.coverUrl) || this.coverUrl === null) &&
            ((0, validator_1.isFile)(this.coverImage) || (0, validator_1.isTypeOf)('string', this.coverImage) || this.coverImage === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isDistinct) || this.isDistinct === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isSuper) || this.isSuper === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isBroadcast) || this.isBroadcast === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isPublic) || this.isPublic === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isStrict) || this.isStrict === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isDiscoverable) || this.isDiscoverable === null) &&
            ((0, validator_1.isTypeOf)('boolean', this.isEphemeral) || this.isEphemeral === null) &&
            ((0, validator_1.isTypeOf)('string', this.accessCode) || this.accessCode === null) &&
            ((0, validator_1.isTypeOf)('string', this.name) || this.name === null) &&
            ((0, validator_1.isTypeOf)('string', this.data) || this.data === null) &&
            ((0, validator_1.isTypeOf)('string', this.customType) || this.customType === null) &&
            ((0, validator_1.isArrayOf)('string', this.operatorUserIds) || this.operatorUserIds === null) &&
            ((0, validator_1.isTypeOf)('number', this.messageSurvivalSeconds) || this.messageSurvivalSeconds === null));
    }
    addUserIds(userIds) {
        if ((0, validator_1.isArrayOf)('string', userIds)) {
            const validUserIds = userIds.filter((userId) => (0, validator_1.isTypeOf)('string', userId));
            for (let i = 0; i < validUserIds.length; i++) {
                this.addUserId(validUserIds[i]);
            }
        }
    }
    addUserId(userId) {
        if ((0, validator_1.isTypeOf)('string', userId)) {
            if (!this.invitedUserIds.includes(userId)) {
                this.invitedUserIds.push(userId);
            }
        }
    }
}
exports.default = GroupChannelCreateParams;
//# sourceMappingURL=groupChannelCreateParams.js.map