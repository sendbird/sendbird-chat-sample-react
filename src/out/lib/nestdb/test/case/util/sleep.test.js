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
const util_1 = require("../../../src/util");
describe('[unit] util/sleep', () => {
    test('sleep()', (done) => __awaiter(void 0, void 0, void 0, function* () {
        let val = 1;
        setTimeout(() => val++, 20);
        yield (0, util_1.sleep)(50);
        expect(val).toBe(2);
        done();
    }));
});
//# sourceMappingURL=sleep.test.js.map