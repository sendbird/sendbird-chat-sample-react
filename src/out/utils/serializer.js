"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
const serialize = (obj, preprocessor = null) => {
    let objectified = JSON.parse(JSON.stringify(obj));
    if (preprocessor)
        preprocessor(objectified);
    return objectified;
};
exports.serialize = serialize;
const deserialize = (obj, postprocessor = null) => {
    const parsed = JSON.parse(JSON.stringify(obj));
    if (postprocessor)
        postprocessor(parsed);
    return parsed;
};
exports.deserialize = deserialize;
//# sourceMappingURL=serializer.js.map