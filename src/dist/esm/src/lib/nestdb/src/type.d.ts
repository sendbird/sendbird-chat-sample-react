export declare type PrimitiveType = boolean | number | string;
export declare const isPrimitiveType: (val: unknown) => boolean;
export declare type Resolve = (result?: unknown) => void;
export declare type Reject = (err: Error) => void;
export declare type BlockKeyHash = (key: string, limit: number) => number;
