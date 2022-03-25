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
exports.convertBlobToBuffer = exports.convertArrayBufferToFile = exports.convertDataURLtoBlob = exports.convertDataURLtoFile = exports.convertDataUrlToByteArray = exports.convertFileToArrayBuffer = exports.convertFileToDataUrl = exports.FileType = void 0;
var FileType;
(function (FileType) {
    FileType["FILE"] = "file";
    FileType["BLOB"] = "blob";
})(FileType = exports.FileType || (exports.FileType = {}));
const convertFileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
};
exports.convertFileToDataUrl = convertFileToDataUrl;
const convertFileToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
};
exports.convertFileToArrayBuffer = convertFileToArrayBuffer;
const convertDataUrlToByteArray = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const byteStr = atob(arr[1]);
    let n = byteStr.length;
    const u8arr = new Uint8Array(n);
    while (n--)
        u8arr[n] = byteStr.charCodeAt(n);
    return [u8arr, mime];
};
exports.convertDataUrlToByteArray = convertDataUrlToByteArray;
const convertDataURLtoFile = (dataUrl, filename) => {
    const [u8arr, mime] = (0, exports.convertDataUrlToByteArray)(dataUrl);
    return new File([u8arr], filename, { type: mime });
};
exports.convertDataURLtoFile = convertDataURLtoFile;
const convertDataURLtoBlob = (dataUrl) => {
    const [u8arr, mime] = (0, exports.convertDataUrlToByteArray)(dataUrl);
    return new Blob([u8arr], { type: mime });
};
exports.convertDataURLtoBlob = convertDataURLtoBlob;
const convertArrayBufferToFile = (buffer, filename) => {
    return new File([buffer], filename);
};
exports.convertArrayBufferToFile = convertArrayBufferToFile;
const convertBlobToBuffer = (blob) => __awaiter(void 0, void 0, void 0, function* () {
    const arrBuffer = yield (0, exports.convertFileToArrayBuffer)(blob);
    return Buffer.from(arrBuffer);
});
exports.convertBlobToBuffer = convertBlobToBuffer;
//# sourceMappingURL=fileConverter.js.map