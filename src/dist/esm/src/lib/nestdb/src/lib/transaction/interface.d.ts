export interface TransactionMetadata {
    generation: number;
}
export interface TransactionRequestData {
    key: string;
    value: object;
}
export interface TransactionRequestOptions {
    persistent?: boolean;
}
export interface TransactionRequest {
    data: TransactionRequestData;
    options?: TransactionRequestOptions;
}
export interface TransactionRecord {
    generation: number;
    requests: TransactionRequest[];
}
export declare enum TransactionEventType {
    COMMIT = 0,
    WRITE = 1,
    ERROR = 2
}
export declare type TransactionEventHandler<T> = (event: T) => void;
