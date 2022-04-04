/// <reference types="node" />
export declare enum FileType {
    FILE = "file",
    BLOB = "blob"
}
/**
 * @internal
 */
export declare const convertFileToDataUrl: (file: Blob) => Promise<string>;
/**
 * @internal
 */
export declare const convertFileToArrayBuffer: (file: Blob) => Promise<ArrayBuffer>;
/**
 * @internal
 */
export declare const convertDataUrlToByteArray: (dataUrl: string) => [Uint8Array, string];
/**
 * @internal
 * Code reference: https://stackoverflow.com/questions/62179675/how-to-convert-image-source-into-a-javascript-file-object
 * Tested on CSB: https://codesandbox.io/s/upload-image-preview-forked-8t14l?file=/index.js:793-954
 */
export declare const convertDataURLtoFile: (dataUrl: string, filename: string) => File;
/**
 * @internal
 * Code reference: https://stackoverflow.com/questions/12168909/blob-from-dataurl
 * Tested on CSB: https://codesandbox.io/s/upload-image-preview-forked-8t14l?file=/index.js
 */
export declare const convertDataURLtoBlob: (dataUrl: string) => Blob;
/**
 * @internal
 */
export declare const convertArrayBufferToFile: (buffer: ArrayBuffer, filename: string) => File;
/**
 * @internal
 */
export declare const convertBlobToBuffer: (blob: Blob) => Promise<Buffer>;
