"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDispatcher = exports.EventDispatcherContext = void 0;
const uuid_1 = require("../utils/uuid");
class EventDispatcherContext {
    constructor({ container }) {
        this._container = {};
        this._container = container;
        this.key = (0, uuid_1.uuid)();
    }
    _register(event, maxOccurence, handler) {
        if (!(event in this._container))
            this._container[event] = new Map();
        this._container[event].set(this.key, {
            occurence: maxOccurence,
            handler,
        });
        return this;
    }
    on(event, handler) {
        return this._register(event, -1, handler);
    }
    once(event, handler) {
        return this._register(event, 1, handler);
    }
    close() {
        for (const event in this._container) {
            this._container[event].delete(this.key);
        }
    }
}
exports.EventDispatcherContext = EventDispatcherContext;
class EventDispatcher {
    constructor() {
        this._container = {};
    }
    on(event, handler) {
        const context = new EventDispatcherContext({ container: this._container });
        return context.on(event, handler);
    }
    once(event, handler) {
        const context = new EventDispatcherContext({ container: this._container });
        return context.once(event, handler);
    }
    dispatch(event, args) {
        const eventMap = this._container[event];
        if (eventMap) {
            const expiredKeys = [];
            for (const key of eventMap.keys()) {
                const info = eventMap.get(key);
                info.handler(args);
                if (info.occurence > 0) {
                    info.occurence--;
                    if (info.occurence === 0)
                        expiredKeys.push(key);
                }
            }
            expiredKeys.forEach((key) => eventMap.delete(key));
        }
    }
}
exports.default = EventDispatcher;
class CommandDispatcher {
    constructor() {
        this._dispatcher = new EventDispatcher();
    }
    on(handler) {
        return this._dispatcher.on('event', handler);
    }
    once(handler) {
        return this._dispatcher.once('event', handler);
    }
    dispatch(command) {
        return this._dispatcher.dispatch('event', command);
    }
}
exports.CommandDispatcher = CommandDispatcher;
//# sourceMappingURL=eventDispatcher.js.map