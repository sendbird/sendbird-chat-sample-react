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
const crypto_js_1 = require("crypto-js");
describe('[unit] encrypt', () => {
    test('encrypt() > decrypt() redirect', () => __awaiter(void 0, void 0, void 0, function* () {
        const encryption = {
            encrypt: (obj) => obj,
            decrypt: (obj) => obj,
        };
        const originalObject = {
            a: 10,
            b: 20,
            c: 30,
        };
        const encrypted = encryption.encrypt(originalObject);
        const decrypted = encryption.encrypt(encrypted);
        expect(encrypted).toStrictEqual(originalObject);
        expect(decrypted).toStrictEqual(originalObject);
    }));
    test('encrypt() > decrypt() stringify', () => __awaiter(void 0, void 0, void 0, function* () {
        const encryption = {
            encrypt: (obj) => {
                return { k: JSON.stringify(obj) };
            },
            decrypt: (obj) => JSON.parse(obj['k']),
        };
        const originalObject = {
            a: 10,
            b: 20,
            c: 30,
        };
        const encrypted = encryption.encrypt(originalObject);
        const decrypted = encryption.decrypt(encrypted);
        expect(encrypted).toStrictEqual({ k: JSON.stringify(originalObject) });
        expect(decrypted).toStrictEqual(originalObject);
    }));
    test('encrypt() > decrypt() crypto.aes', () => __awaiter(void 0, void 0, void 0, function* () {
        const secret = 'this-is-secret-key';
        const encryption = {
            encrypt: (obj) => {
                return { k: crypto_js_1.default.AES.encrypt(JSON.stringify(obj), secret).toString() };
            },
            decrypt: (obj) => {
                return JSON.parse(crypto_js_1.default.AES.decrypt(obj['k'], secret).toString(crypto_js_1.default.enc.Utf8));
            },
        };
        const originalObject = {
            a: 10,
            b: 20,
            c: 30,
        };
        const encrypted = encryption.encrypt(originalObject);
        const decrypted = encryption.decrypt(encrypted);
        expect(decrypted).toStrictEqual(originalObject);
    }));
});
//# sourceMappingURL=encrypt.test.js.map