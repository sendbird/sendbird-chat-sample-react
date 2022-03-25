"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["VERBOSE"] = 0] = "VERBOSE";
    LogLevel[LogLevel["WARNING"] = 100] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 200] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
const _globalLogger = {};
class Logger {
    constructor(_iid) {
        this._level = LogLevel.ERROR;
        if (!_globalLogger[_iid])
            _globalLogger[_iid] = this;
        return _globalLogger[_iid];
    }
    static of(_iid) {
        return _globalLogger[_iid];
    }
    set level(value) {
        this._level = value;
    }
    log(...messages) {
        console.log(...messages);
    }
    warning(...messages) {
        if (this._level >= LogLevel.WARNING) {
            this.log(...messages);
        }
    }
    error(...messages) {
        if (this._level >= LogLevel.ERROR) {
            this.log(...messages);
        }
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map