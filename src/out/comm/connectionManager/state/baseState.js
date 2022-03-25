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
class BaseConnectionState {
    constructor() {
        this.type = stateType_1.ConnectionStateType.NONE;
    }
    run(context) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onConnect(context, url) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onReconnect(context) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onDisconnect(context, { error = null, autoReconnect = false, }) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onLogout(context) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = BaseConnectionState;
//# sourceMappingURL=baseState.js.map