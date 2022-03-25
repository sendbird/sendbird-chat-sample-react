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
const stateType_1 = require("../stateType");
const baseState_1 = require("./baseState");
const initializedState_1 = require("./initializedState");
class ConnectionLogoutState extends baseState_1.default {
    constructor() {
        super(...arguments);
        this.type = stateType_1.ConnectionStateType.LOGOUT;
    }
    run(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const disconnectedUserId = context.sdkState.userId;
            context.logout();
            context.connectionHandlers.forEach(handler => handler.onDisconnected(disconnectedUserId));
            yield context.changeState(new initializedState_1.default());
        });
    }
}
exports.default = ConnectionLogoutState;
//# sourceMappingURL=logoutState.js.map