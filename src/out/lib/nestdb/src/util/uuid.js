"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
const uuid = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};
exports.uuid = uuid;
//# sourceMappingURL=uuid.js.map