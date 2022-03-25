"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = void 0;
const util_1 = require("../../util");
const match = (condition, item) => {
    if (!item)
        return false;
    if (typeof condition !== 'function') {
        for (const operator in condition) {
            if (['/and', '&&'].includes(operator)) {
                const queries = condition[operator];
                if (queries.some((query) => !(0, exports.match)(query, item)))
                    return false;
            }
            else if (['/or', '||'].includes(operator)) {
                const queries = condition[operator];
                if (queries.every((query) => !(0, exports.match)(query, item)))
                    return false;
            }
            else if (operator === '/where') {
                const query = condition[operator];
                if (!query(item))
                    return false;
            }
            else {
                const property = operator;
                if (typeof condition[property] === 'object') {
                    const conditions = condition[property];
                    for (const operator in conditions) {
                        switch (operator) {
                            case '/eq':
                            case '=': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!(value === operand))
                                    return false;
                                break;
                            }
                            case '/neq':
                            case '!=': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!(value !== operand))
                                    return false;
                                break;
                            }
                            case '/gt':
                            case '>': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!((0, util_1.compare)(value, operand) > 0))
                                    return false;
                                break;
                            }
                            case '/gte':
                            case '>=': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!((0, util_1.compare)(value, operand) >= 0))
                                    return false;
                                break;
                            }
                            case '/lt':
                            case '<': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!((0, util_1.compare)(value, operand) < 0))
                                    return false;
                                break;
                            }
                            case '/lte':
                            case '<=': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!((0, util_1.compare)(value, operand) <= 0))
                                    return false;
                                break;
                            }
                            case '/in': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!operand.includes(value))
                                    return false;
                                break;
                            }
                            case '/nin': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (operand.includes(value))
                                    return false;
                                break;
                            }
                            case '/contain': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!value.includes(operand))
                                    return false;
                                break;
                            }
                            case '/regex': {
                                const value = item[property];
                                const operand = conditions[operator];
                                if (!operand.test(value))
                                    return false;
                                break;
                            }
                            case '/where': {
                                const value = item[property];
                                const comparator = conditions[operator];
                                if (!comparator(value))
                                    return false;
                                break;
                            }
                        }
                    }
                }
                else if (typeof condition[property] === 'function') {
                    if (!condition[property](item[property])) {
                        return false;
                    }
                }
                else {
                    if (condition[property] !== item[property]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    else {
        return condition(item);
    }
};
exports.match = match;
//# sourceMappingURL=match.js.map