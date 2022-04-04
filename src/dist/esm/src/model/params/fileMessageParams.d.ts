import FileMessage from '../message/fileMessage';
import { BaseMessageParamsProperties } from './baseMessageParams';
import { FileCompat } from '../../types';
export declare type FileParams = FileCompat | string;
export interface ThumbnailSize {
    maxWidth: number;
    maxHeight: number;
}
export declare class FileMessageParamsProperties extends BaseMessageParamsProperties {
    file: FileParams;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnailSizes?: ThumbnailSize[];
}
export default class FileMessageParams extends FileMessageParamsProperties {
    constructor(props?: FileMessageParamsProperties);
    get fileUrl(): string;
    set fileUrl(value: string);
    static fromFailedFileMessage(failedMessage: FileMessage, blob: Blob): FileMessageParams;
    validate(): boolean;
}
