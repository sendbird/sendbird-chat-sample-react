/**
 * @internal
 */
export declare class Deferred<T> {
    readonly promise: Promise<T>;
    resolve: (value?: (T | PromiseLike<T>)) => void;
    reject: (reason?: any) => void;
    constructor();
}
