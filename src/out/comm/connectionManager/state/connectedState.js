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
const reconnectingState_1 = require("./reconnectingState");
const disconnectedState_1 = require("./disconnectedState");
const logoutState_1 = require("./logoutState");
class ConnectionConnectedState extends baseState_1.default {
    constructor() {
        super(...arguments);
        this.type = stateType_1.ConnectionStateType.CONNECTED;
    }
    onReconnect(context) {
        return __awaiter(this, void 0, void 0, function* () {
            context.disconnect();
            yield context.changeState(new reconnectingState_1.default());
        });
    }
    onDisconnect(context, { autoReconnect }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield context.changeState(new disconnectedState_1.default({ autoReconnect }));
        });
    }
    onLogout(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield context.changeState(new logoutState_1.default());
        });
    }
}
exports.default = ConnectionConnectedState;
//# sourceMappingURL=connectedState.js.map