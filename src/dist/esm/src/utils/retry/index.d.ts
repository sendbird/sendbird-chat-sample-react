import { RetryStrategy } from './retryStrategy';
import { Immediate } from './strategy/immediate';
export declare type HaltAsyncRetry = (err?: Error) => void;
export declare type ResetAsyncRetry = () => void;
/**
 * @internal
 */
export declare const asyncRetry: <T extends unknown>(executor: (halt?: HaltAsyncRetry, reset?: ResetAsyncRetry) => Promise<T>, maxRetry: number, strategy?: RetryStrategy) => Promise<T>;
export { Immediate, RetryStrategy, };
