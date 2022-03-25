"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStateType = void 0;
var ConnectionStateType;
(function (ConnectionStateType) {
    ConnectionStateType[ConnectionStateType["NONE"] = 0] = "NONE";
    ConnectionStateType[ConnectionStateType["INITIALIZED"] = 1] = "INITIALIZED";
    ConnectionStateType[ConnectionStateType["CONNECTING"] = 2] = "CONNECTING";
    ConnectionStateType[ConnectionStateType["CONNECTED"] = 3] = "CONNECTED";
    ConnectionStateType[ConnectionStateType["RECONNECTING"] = 4] = "RECONNECTING";
    ConnectionStateType[ConnectionStateType["DISCONNECTED"] = 5] = "DISCONNECTED";
    ConnectionStateType[ConnectionStateType["LOGOUT"] = 6] = "LOGOUT";
})(ConnectionStateType = exports.ConnectionStateType || (exports.ConnectionStateType = {}));
//# sourceMappingURL=stateType.js.map